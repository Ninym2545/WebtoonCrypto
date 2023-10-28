import { NextResponse } from "next/server";
import Webtoon from "../../../models/Content";
import connect from "@/utils/db";

await connect();
export const GET = async (request) => {
  try {
    const webtoon = await Webtoon.find();
    console.log('contents' , webtoon);
    return new NextResponse(JSON.stringify(webtoon), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error!", { status: 500 });
  }
};
