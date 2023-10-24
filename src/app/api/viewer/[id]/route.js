import { NextResponse } from "next/server";
import Contents from "../../../../models/Content";
import { ObjectId } from "mongodb";
import connect from "@/utils/db";

export const GET = async (request , {params}) => {
    const {id} = params;
  try {
    await connect();

    const content = await Contents.findOne({"chapter._id":id})
  
    const chater = content.chapter.find(chap=> chap._id.toString() === id) 


    return new NextResponse(JSON.stringify(chater), { status: 200 });
  } catch (err) {
    console.log(err)
    return new NextResponse("Database Error!", { status: 500 });
  }
};