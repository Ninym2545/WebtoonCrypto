import { NextResponse } from "next/server";
import Contents from "../../../../models/Content";
import connect from "@/utils/db";

export const GET = async (request , {params}) => {
    const {id} = params;
  try {
    await connect();
    const webtoon = await Contents.findById({
      _id: id
    })


    return new NextResponse(JSON.stringify(webtoon), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error!", { status: 500 });
  }
};

