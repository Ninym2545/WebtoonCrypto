import { NextResponse } from "next/server";
import User from "../../../models/User";
import connect from "@/utils/db";

export const GET = async (request) => {
  try {
    await connect();
    const webtoon = await User.find();

    return new NextResponse(JSON.stringify(webtoon), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error!", { status: 500 });
  }
};
