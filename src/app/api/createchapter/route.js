"use server";
import { NextResponse } from "next/server";
import Contents from "@/models/Content";
import connect from "@/utils/db";


await connect();
export const GET = async (request) => {
  try {
    const chapter = await Contents.find();
    console.log('chapterContent' , chapter);
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

