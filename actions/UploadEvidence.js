"use server"

import connect from "@/utils/db";
import Evidence from '../src/models/Evidence'
import { revalidatePath } from 'next/cache'
import User from "@/models/User";
import axios from "axios";



const delay = (delayInms) => {
  return new Promise((resolve) => setTimeout(resolve, delayInms));
};
export async function uploadImage(formData, folderName) {
  try {
    const timestamp = Date.now(); // Returns the current timestamp in milliseconds since January 1, 1970 (Unix epoch)
    formData.append("upload_preset", "v3rzjvmh");
    formData.append(
      "public_id",
      `${folderName}/${formData.getAll("file")[0].name}`
    );
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dfhkaphai/image/upload",
      formData,
      {
        headers: {
          "X-CLOUDINARY-API-KEY": "784942399357991",
          "X-CLOUDINARY-TIMESTAMP": timestamp,
          "X-CLOUDINARY-SIGNATURE": "TRXJ90T5cX_D4c_DGiyD2MlGiUM",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log("error", error);
  }
}
export async function createEvidence( user , formDataContent, formData ) {
  try {
    await connect();
     console.log('Data' , user);
    const imgFg = await uploadImage(formData, "evidence");
    // console.log("Forground --> ", imgFg);

    // Create a new evidence object
    const newEvidence = new Evidence({
      user_id: user,
      user_name: formDataContent.name,
      tel: formDataContent.phone,
      Address: formDataContent.address,
      Evidence: imgFg.secure_url, // Remove unnecessary string interpolation
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

    //revalidatePath("/")
    console.log('Create Content Success');
    return { msg: "Create Content Success. !" };
  } catch (error) {
    console.log(error);
    return { errMsg: error.massage };
  }
}



  export async function revalidate(path) {
    revalidatePath(path);
  }
  