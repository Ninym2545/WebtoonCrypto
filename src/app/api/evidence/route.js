"use server"
import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Evidence from '../../../models/Evidence'



export const GET = async (request) => {
  try {
    await connect();
    const chapter = await Evidence.find();

    return new NextResponse(JSON.stringify(chapter), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error!", { status: 500 });
  }
};
