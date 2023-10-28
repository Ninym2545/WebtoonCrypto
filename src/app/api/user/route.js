"use server"

import { NextResponse } from "next/server";
import User from "../../../models/User";
import connect from "@/utils/db";

await connect();
export const GET = async (request) => {
  try {
    const webtoon = await User.find();
    console.log( 'user ---> ' , webtoon);
    return new NextResponse(JSON.stringify(webtoon), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error!", { status: 500 });
  }
};
