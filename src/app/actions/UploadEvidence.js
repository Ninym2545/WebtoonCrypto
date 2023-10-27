"use server"

import connect from "@/utils/db";
import Evidence from '../../models/Evidence'

import path, { resolve } from 'path'
import fs from 'fs/promises'
import {v4 as uuidv4} from 'uuid'
import os from 'os'
import cloudinary from 'cloudinary'
import { revalidatePath } from 'next/cache'
import User from "@/models/User";


connect();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});


async function saveChapterToLocal(formData){
    const files = formData.getAll('files')
  
    const multipleBuffersPromise = files.map(file => (
        file.arrayBuffer().then(data => {
            const buffer = Buffer.from(data)
            const name = uuidv4()
            const ext = file.type.split("/")[1]
  
            // console.log("Originalname",{name , ext})
            
  
            // const uploadDir = path.join(process.cwd(), "public" , `/${name}.${ext}`)
  
            const tempdir = os.tmpdir();
            const uploadDir = path.join(tempdir, `/${file.name}.${ext}`)
  
            fs.writeFile(uploadDir, buffer)
            return {filepath: uploadDir, filename: file.name}
            
        })
    ))
  
    return await Promise.all(multipleBuffersPromise)
  }

async function uploadChapterToCloudinary(newFiles) {
    const multiplePhotosPromise = newFiles.map(file => {
        // You can set a custom public name here based on your requirement.
        const publicName = `${file.filename}`;
  
        return cloudinary.v2.uploader.upload(file.filepath, {
            folder: 'evidence',
            public_id: publicName  // Setting the custom public_id
        });
    });
  
    return await Promise.all(multiplePhotosPromise);
  }

export async function createEvidence(user , formDataContent, formData){
  
    try{
       // Save photo files to temp folder
       const newFiles = await saveChapterToLocal(formData)
      
      //  console.log(formDataContent)
       const photos = await uploadChapterToCloudinary(newFiles)
      
      // Delete photo files in temp folder after successful upload
       newFiles.map(file => fs.unlink(file.filepath))
      
         
    // Extract image URLs from photos
    const pos_url = photos.map(img => img.url);

    // Create a new evidence object
    const newEvidence = new Evidence({
      user_id: user,
      user_name: formDataContent.name,
      tel: formDataContent.phone,
      Address: formDataContent.address,
      Evidence: `${pos_url}`, // Remove unnecessary string interpolation
    });

          
     await newEvidence.save();
        await User.findOneAndUpdate(
            {
              _id: user,
            },
            {
              $set: { role: 'prending' },
            }
          );
      
        console.log('create succress', newEvidence);
  
      //  await delay(5000)

      return {msg: 'Upload Success'}
  
  }catch(error){
      return {errMsg: error.massage}
  }
  
  }