"use server";
import Contents from "@/models/Content";
import connect from "@/utils/db";
import { revalidatePath } from "next/cache";
import axios from "axios";


const deley = (delayInms) => {
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

export async function uploadChapter(formData , formDataImg , chapternumber, title, dataselect, isSwitchOn) {
  try {
    await connect();
    const result = await uploadImage(formData, "chapter_upload");
    //  console.log("result", result);

    const files = formDataImg.getAll("files");
    // console.log("file", files);
    const multipleBuffersPromise = files.map(async (file) => {
      const formDataImg = new FormData()
      formDataImg.append('file', file)
      // console.log('file' , formDataImg);
      const result = await uploadImage(formDataImg, "webtoon_upload");
      // console.log('results' , result);
      return result
    } 
    );
    const resultArray =  await Promise.all(multipleBuffersPromise);
    //  console.log('resultArray' , resultArray)

    // await deley(2000)

    const contentId = await Contents.findById({
      _id: dataselect._id,
    });
    

     contentId.chapter = [
      ...contentId.chapter,
      {
        title: title,
        index: chapternumber,
        img: `${result.secure_url}`,
        upload: isSwitchOn,
        data_img: resultArray.map((img) => ({
          name: img.public_id,
          url: img.secure_url ,
        })),
      },
    ];

    // console.log("hello", contentId);

  await Contents.findByIdAndUpdate(
      {
        _id: dataselect._id,
      },
      { chapter: contentId.chapter }
    );

    // revalidatePath("/")
     console.log("Create ChapterContent Success.!");
    return { msg: "Upload Success!" };
  } catch (error) {
    console.log(error);
    return { errMsg: error.message };
  }
}

export async function revalidate(path) {
  revalidatePath(path);
}
