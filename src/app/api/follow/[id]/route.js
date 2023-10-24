import { NextResponse } from "next/server";
import Follow from '../../../../models/Follow';
import connect from "@/utils/db";

export const GET = async (request , {params}) => {
    const {id} = params;
  try {
    await connect();
    const webtoon = await Follow.find({
      user_id : id
    })

  
    return new NextResponse(JSON.stringify(webtoon), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error!", { status: 500 });
  }
};

