import { NextResponse } from "next/server";
import Contents from "../../../../models/Content";
import connect from "@/utils/db";

await connect();
export const GET = async (request , {params}) => {
    const {id} = params;
  try {
    const webtoon = await Contents.find({
      id_creater : id
    })

  
    return new NextResponse(JSON.stringify(webtoon), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error!", { status: 500 });
  }
};

