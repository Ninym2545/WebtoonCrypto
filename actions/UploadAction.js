"use server"

import path, { resolve } from "path";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import os from "os";
import cloudinary from "cloudinary";
import Contents from "@/models/Content";
import connect from "@/utils/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

async function saveChapterToLocal(formData) {
  try {
    const files = formData.getAll("files");

    const multipleBuffersPromise = files.map(file => (
      file.arrayBuffer()
      .then(data => {
        const buffer = Buffer.from(data)
        const name = uuidv4()
        const ext = file.type.split("/")[1]

        const tempdir = os.tmpdir();
        const uploadDir = path.join(tempdir, `/${file.name}.${ext}`);

        fs.writeFile(uploadDir, buffer);
        return { filepath: uploadDir, filename: file.name };
      })
    ))
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

const deley = (delayInms) => {
  return new Promise(resolve => setTimeout(resolve, delayInms));
}

export async function uploadChapter(
  formData,
  formDataImg,
  chapternumber,
  title,
  dataselect,
  isSwitchOn
) {
  try {
    await connect();
    const _id = dataselect._id;
    // Save photo files to temp folder
    const newFiles = await saveChapterToLocal(formData)
    const photos = await uploadChapterToCloudinary(newFiles);
    // Delete photo files in temp folder after successful upload
    newFiles.map((file) => fs.unlink(file.filepath));

    // Save photo files to temp folder
    const newFilesImgs = await savePhotosToLocalDataImgs(formDataImg);
    const dataImg = await uploadPhotoToCloudinaryDataImgs(newFilesImgs);
    newFilesImgs.map((file) => fs.unlink(file.filepath));

    const imgchapter = photos.map((img) => {
      const pos = img.url;
      return pos;
    });

    // await deley(2000)

    const contentsid = await Contents.findById({
      _id: _id,
    });
    console.log("hello", contentsid);

    contentsid.chapter = [
      ...contentsid.chapter,
      {
        title: title,
        index: chapternumber,
        img: `${imgchapter}`,
        upload: isSwitchOn,
        data_img: dataImg.map((img) => ({
          name: img.public_id,
          url: img.secure_url ,
        })),
      },
    ];

    await Contents.findByIdAndUpdate(
      {
        _id: _id,
      },
      { chapter: contentsid.chapter }
    );

    revalidatePath("/")
    console.log("Create ChapterContent Success.!", contentsid);
    return {msg: 'Upload Success!'}
  } catch (error) {
    console.log(error);
    return {errMsg: error.message}
  }
}

export async function revalidate(path){
  revalidatePath(path)
}