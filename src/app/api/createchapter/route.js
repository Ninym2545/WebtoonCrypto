"use server";
import { NextResponse } from "next/server";

import path, { resolve } from "path";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import os from "os";
import cloudinary from "cloudinary";
import { revalidatePath } from "next/cache";
import Contents from "@/models/Content";
import connect from "@/utils/db";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const GET = async (request) => {
  try {
    await connect();
    const chapter = await Contents.find();

    return new NextResponse(JSON.stringify(chapter), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error!", { status: 500 });
  }
};

export const PUT = async (require) => {
  try {
    const { _id } = await require.json();

    // Find the document in the collection where "chapter._id" matches the provided _id
    const contents = await Contents.findOne({ "chapter._id": _id });
    console.log('contents ---> ', contents);
    
    // Filter out the item with the matching _id from the "chapter" array
    const filteredChapter = contents?.chapter.filter((item) => item._id != _id);
    console.log('filter --> ', filteredChapter);
    
    // Find the document in the collection again with the same filter
    const updatedContents = await Contents.findOne({ "chapter._id": _id });
    
    // Update the document with the filtered "chapter" array
    updatedContents.chapter = filteredChapter;
    
    // Save the updated document back to the collection
    await updatedContents.save();
    
    console.log('update --> ', updatedContents);

    return new NextResponse(JSON.stringify(updatedContents), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return new NextResponse(error.message, {
      status: 500,
    });
  }
};



async function saveChapterToLocal(formData) {
  try {
    const files = formData.getAll("files");

    const multipleBuffersPromise = files.map((file) =>
      file.arrayBuffer().then((data) => {
        const buffer = Buffer.from(data);
        const name = uuidv4();
        const ext = file.type.split("/")[1];

        const tempdir = os.tmpdir();
        const uploadDir = path.join(tempdir, `/${file.name}.${ext}`);

        fs.writeFile(uploadDir, buffer);
        return { filepath: uploadDir, filename: file.name };
      })
    )
    return await Promise.all(multipleBuffersPromise);
  } catch (error) {
    console.log("error ---> ", error);
  }
}

async function uploadChapterToCloudinary(newFiles) {
  const multiplePhotosPromise = newFiles.map((file) => {
    // You can set a custom public name here based on your requirement.
    const publicName = `${file.filename}`;

    return cloudinary.v2.uploader.upload(file.filepath, {
      folder: "chapter_upload",
      public_id: publicName, // Setting the custom public_id
    });
  });

  return await Promise.all(multiplePhotosPromise);
}

async function savePhotosToLocalDataImgs(formDataImg) {
  const files = formDataImg.getAll("files");

  const multipleBuffersPromise = files.map((file) =>
    file.arrayBuffer().then((data) => {
      const buffer = Buffer.from(data);
      const name = uuidv4();
      const ext = file.type.split("/")[1];

      const tempdir = os.tmpdir();
      const uploadDir = path.join(tempdir, `/${file.name}.${ext}`);

      fs.writeFile(uploadDir, buffer);
      return { filepath: uploadDir, filename: file.name };
    })
  );

  return await Promise.all(multipleBuffersPromise);
}

async function uploadPhotoToCloudinaryDataImgs(newFilesImgs) {
  const multiplePhotosPromise = newFilesImgs.map((file) => {
    // You can set a custom public name here based on your requirement.
    const publicName = `${file.filename}`;

    return cloudinary.v2.uploader.upload(file.filepath, {
      folder: "webtoon_upload",
      public_id: publicName, // Setting the custom public_id
    });
  });

  return await Promise.all(multiplePhotosPromise);
}

export async function uploadchapter(formData, formDataImg, chapternumber, title, dataselect , isSwitchOn) {
  try {
    await connect();
    const _id = dataselect._id;
    // Save photo files to temp folder
    const newFiles = await saveChapterToLocal(formData);
    //  console.log(newFiles)
    const photos = await uploadChapterToCloudinary(newFiles);
    // Delete photo files in temp folder after successful upload
    newFiles.map((file) => fs.unlink(file.filepath));

    // Save photo files to temp folder
    const newFilesImgs = await savePhotosToLocalDataImgs(formDataImg);
    //  console.log(newFiles)
    const dataImg = await uploadPhotoToCloudinaryDataImgs(newFilesImgs);
    // Delete photo files in temp folder after successful upload
    newFilesImgs.map((file) => fs.unlink(file.filepath));

    const imgchapter = photos.map((img) => {
      const pos = img.url;
      return pos;
    });

    const contentsid = await Contents.findById({
      _id: _id,
    });
    console.log('hello' , contentsid);
    contentsid.chapter = [
      ...contentsid.chapter,
      {
        title: title,
        index: chapternumber,
        img: `${imgchapter}`,
        upload: isSwitchOn,
        data_img: dataImg.map(img => ({
          name: img.public_id,
          url: img.url
        }))
      }
    ];

    // console.log("update",contentsid)
    await Contents.findByIdAndUpdate({
      _id: _id
    },{chapter : contentsid.chapter })

  
    console.log('create chapter complete' , contentsid );
    return {msg: 'Upload Success'}
  } catch (error) {
    console.log(error);
    return { errMsg: error.massage };
  }
}


