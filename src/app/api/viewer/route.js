import { NextResponse } from "next/server";
import ChapterImg from "../../../models/ChapterImg";
import connect from "@/utils/db";

export const GET = async (request) => {
  try {
    await connect();
    const chapterimg = await ChapterImg.find();

    return new NextResponse(JSON.stringify(chapterimg), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error!", { status: 500 });
  }
};
