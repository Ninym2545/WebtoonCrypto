"use server"
import Webtoon from "../../models/Content";

import path, { resolve } from 'path'
import fs from 'fs/promises'
import {v4 as uuidv4} from 'uuid'
import os from 'os'
import cloudinary from 'cloudinary'
import { revalidatePath } from 'next/cache'
import connect from "@/utils/db";


connect();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

async function saveChapterToLocal(formDatafg){
  const files = formDatafg.getAll('files')

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
async function saveChapterToLocalbg(formDatabg){
  const files = formDatabg.getAll('files')
  
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
async function saveChapterToLocallogo(formDatalogo){
  const files = formDatalogo.getAll('files')
  
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
async function saveChapterToLocaldetail(formDatadetail){
  const files = formDatadetail.getAll('files')
  
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
          folder: 'contents_upload',
          public_id: publicName  // Setting the custom public_id
      });
  });

  return await Promise.all(multiplePhotosPromise);
}
async function uploadChapterToCloudinarybg(newFilesbg) {
  const multiplePhotosPromise = newFilesbg.map(file => {
      // You can set a custom public name here based on your requirement.
      const publicName = `${file.filename}`;

      return cloudinary.v2.uploader.upload(file.filepath, {
          folder: 'contents_upload',
          public_id: publicName  // Setting the custom public_id
      });
  });

  return await Promise.all(multiplePhotosPromise);
}
async function uploadChapterToCloudinarylogo(newFileslogo) {
  const multiplePhotosPromise = newFileslogo.map(file => {
      // You can set a custom public name here based on your requirement.
      const publicName = `${file.filename}`;

      return cloudinary.v2.uploader.upload(file.filepath, {
          folder: 'contents_upload',
          public_id: publicName  // Setting the custom public_id
      });
  });

  return await Promise.all(multiplePhotosPromise);
}
async function uploadChapterToCloudinarydetail(newFilesdetail) {
  const multiplePhotosPromise = newFilesdetail.map(file => {
      // You can set a custom public name here based on your requirement.
      const publicName = `${file.filename}`;

      return cloudinary.v2.uploader.upload(file.filepath, {
          folder: 'contents_upload',
          public_id: publicName  // Setting the custom public_id
      });
  });

  return await Promise.all(multiplePhotosPromise);
}

const delay = (delayInms) => {
  return new Promise(resolve => setTimeout(resolve, delayInms))
}

export async function uploadcontents(formDatafg, formDatabg, formDatalogo, formDatadetail, formDataContent, user, username){
  
  try{
 
     // Save photo files to temp folder
     const newFiles = await saveChapterToLocal(formDatafg)
     const newFilesbg = await saveChapterToLocalbg(formDatabg)
     const newFileslogo = await saveChapterToLocallogo(formDatalogo)
     const newFilesdetail = await saveChapterToLocaldetail(formDatadetail)
    //  console.log(formDataContent)
     const photos = await uploadChapterToCloudinary(newFiles)
     const photosbg = await uploadChapterToCloudinarybg(newFilesbg)
     const photoslogo = await uploadChapterToCloudinarylogo(newFileslogo)
     const photosdetail = await uploadChapterToCloudinarydetail(newFilesdetail)
    // Delete photo files in temp folder after successful upload
     newFiles.map(file => fs.unlink(file.filepath))
     newFilesbg.map(file => fs.unlink(file.filepath))
     newFileslogo.map(file => fs.unlink(file.filepath))
     newFilesdetail.map(file => fs.unlink(file.filepath))
       
     const pos_url = photos.map(img =>{
       const pos = img.url
       return pos
     })
     const bg_url = photosbg.map(img =>{
       const pos = img.url
       return pos
     })
     const logo_url = photoslogo.map(img =>{
       const pos = img.url
       return pos
     })
     const detail_url = photosdetail.map(img =>{
       const pos = img.url
       return pos
     })
    
    

        const newwebtoon = new Webtoon({
          title: formDataContent.title ,
          author: formDataContent.author,
          desc: formDataContent.Synopsis,
          category: formDataContent.category,
          day: formDataContent.upload,
          poster: `${pos_url}`,
          background:`${bg_url}`,
          logo: `${logo_url}` ,
          poster_deatils:`${detail_url}`,
          id_creater: user,
          creater_name:username
        })
        // console.log("createContents ---> ",newwebtoon);
        // return newimage;
    
       await Webtoon.create(newwebtoon)
    


    //  await delay(5000)

    revalidatePath("/")
    return {msg: 'Upload Success'}

}catch(error){
    return {errMsg: error.massage}
}

}
export async function updatecontents(formDatafg , formDatabg , formDatalogo , formDatadetail , formDataContent , user , dataselect){
  
  try{
    
    const contentsID = dataselect[0]._id
    // console.log('contentsID ---> ' , contentsID);
     // Save photo files to temp folder
     const newFiles = await saveChapterToLocal(formDatafg)
     const newFilesbg = await saveChapterToLocalbg(formDatabg)
     const newFileslogo = await saveChapterToLocallogo(formDatalogo)
     const newFilesdetail = await saveChapterToLocaldetail(formDatadetail)
    //  console.log(formDataContent)
     const photos = await uploadChapterToCloudinary(newFiles)
     const photosbg = await uploadChapterToCloudinarybg(newFilesbg)
     const photoslogo = await uploadChapterToCloudinarylogo(newFileslogo)
     const photosdetail = await uploadChapterToCloudinarydetail(newFilesdetail)
    // Delete photo files in temp folder after successful upload
     newFiles.map(file => fs.unlink(file.filepath))
     newFilesbg.map(file => fs.unlink(file.filepath))
     newFileslogo.map(file => fs.unlink(file.filepath))
     newFilesdetail.map(file => fs.unlink(file.filepath))
       
     const pos_url = photos.map(img =>{
       const pos = img.url
       return pos
     })
     const bg_url = photosbg.map(img =>{
       const pos = img.url
       return pos
     })
     const logo_url = photoslogo.map(img =>{
       const pos = img.url
       return pos
     })
     const detail_url = photosdetail.map(img =>{
       const pos = img.url
       return pos
     })
    
      const contentsUpdate =  await Webtoon.findOneAndUpdate(
      {
        _id : contentsID,
      },
      { $set: { 
        poster: `${pos_url}`,
         background:`${bg_url}`,
         logo: `${logo_url}` ,
        poster_deatils:`${detail_url}`, 
      } },
      { new: true }
      
    )

    console.log("update --> ",contentsUpdate);
    
    revalidatePath("/")
    return {msg: 'Upload Success'}

}catch(error){
    return {errMsg: error.massage}
}

}

export async function deleteContent(_id){

  try{
    console.log(_id)

   const heero = await Webtoon.findOneAndDelete({_id})
  //  console.log(heero)
      //  await Promise.all([
      //   Webtoon.deleteOne({_id})
      //  ])
       return {msg: 'Delete Success'}

  }catch(error){
      return {errMsg: error.massage}
  }
 
}




