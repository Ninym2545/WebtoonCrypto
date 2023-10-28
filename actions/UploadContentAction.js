"use server"

import Contents from "@/models/Content";
import { revalidatePath } from "next/cache";
import connect from "@/utils/db";
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
export async function uploadcontents(
  formDatafg,
  formDatabg,
  formDatalogo,
  formDatadetail,
  formDataContent,
  user,
  username
) {
  try {
    await connect();
    // console.log('Data' , formDataContent);
    const imgFg = await uploadImage(formDatafg, "contents_upload");
    // console.log("Forground --> ", imgFg);
    const imgBg = await uploadImage(formDatabg, "contents_upload");
    // console.log("Background --> ", imgBg);
    const imgLogo = await uploadImage(formDatalogo, "contents_upload");
    // console.log("Logo --> ", imgLogo);
    const imgDetail = await uploadImage(formDatadetail, "contents_upload");
    // console.log("Detail --> ", imgDetail);

    const newWebtoon = new Contents({
      title: formDataContent.title,
      author: formDataContent.author,
      desc: formDataContent.Synopsis,
      category: formDataContent.category,
      day: formDataContent.upload,
      poster: `${imgFg.secure_url}`,
      background: `${imgBg.secure_url}`,
      logo: `${imgLogo.secure_url}`,
      poster_deatils: `${imgDetail.secure_url}`,
      id_creater: user,
      creater_name: username,
    });

     await Contents.create(newWebtoon);

    //  await delay(5000)

    //revalidatePath("/")
    console.log('Create Content Success');
    return { msg: "Create Content Success. !" };
  } catch (error) {
    console.log(error);
    return { errMsg: error.massage };
  }
}

export async function updateContent(dataselect , formDatafg, formDatabg, formDatalogo, formDatadetail){

  try{
     await connect();
    //   console.log('id' ,dataselect._id);
    // console.log('dataselect1 ---> ' , formDatafg);
    // console.log('dataselect2 ---> ' , formDatabg);
    // console.log('dataselect3 ---> ' , formDatalogo);
    // console.log('dataselect4 ---> ' , formDatadetail);
    const contentsID = dataselect._id
    //  console.log('Data' , contentsID);
    const imgFg = await uploadImage(formDatafg, "contents_upload");
    //  console.log("Forground --> ", imgFg);
    const imgBg = await uploadImage(formDatabg, "contents_upload");
    //  console.log("Background --> ", imgBg);
    const imgLogo = await uploadImage(formDatalogo, "contents_upload");
    //  console.log("Logo --> ", imgLogo);
    const imgDetail = await uploadImage(formDatadetail, "contents_upload");
    //  console.log("Detail --> ", imgDetail);

    await Contents.findOneAndUpdate(
      { _id: contentsID },
      {
        $set: {
          poster: imgFg.secure_url,
          background: imgBg.secure_url,
          logo: imgLogo.secure_url,
          poster_details: imgDetail.secure_url,
        },
      },
      { new: true }
    );
    // revalidatePath("/")
     console.log("Update Contents Success.!" );
    return {msg: 'Update Contents Success.!'}

}catch(error){
  console.log(error);
    return {errMsg: error.massage}
}

}

export async function revalidate(path) {
  revalidatePath(path);
}
