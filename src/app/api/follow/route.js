"use server";
import { NextResponse } from "next/server";
import connect from "@/utils/db";
import User from "../../../models/User";
import Follow from '../../../models/Follow';
import Content from '../../../models/Content';

await connect();
export const GET = async (request) => {
    try {
      const chapter = await Follow.find();
      console.log('follow' ,chapter);
      return new NextResponse(JSON.stringify(chapter), { status: 200 });
    } catch (err) {
      return new NextResponse("Database Error!", { status: 500 });
    }
  };

export const POST = async (require) => {
  try {
    const { content_id , status ,user_id} = await require.json();

    const newFollow = new Follow({
        user_id: user_id,
        content_id: content_id,
        status: true
      });
      
    await newFollow.save();  
    console.log('create Follow ---> ', newFollow);
    return new NextResponse(
      JSON.stringify(newFollow),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(error.message, {
      status: 500,
    });
  }
};

export const DELETE = async (require) => {
  try {
    const { index} = await require.json();
    console.log('_id ---> ' , index);
  // Delete the document by its _id
    const unfollow = await Follow.deleteOne({ _id: index });

    console.log('delete ' , unfollow);

    return new NextResponse(
      JSON.stringify(unfollow),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(error.message, {
      status: 500,
    });
  }
}
