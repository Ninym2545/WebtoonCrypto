"use server"
import { NextResponse } from "next/server";
import Category from '../../../models/Webtype'
import connect from "@/utils/db";

await connect();
export const GET = async (request) => {
  try {
    const category = await Category.find();
    console.log('category' , category);
    return new NextResponse(JSON.stringify(category), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error!", { status: 500 });
  }
};
