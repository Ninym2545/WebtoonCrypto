import { NextResponse } from "next/server";
import RateCoin from "@/models/RateCoin";
import connect from "@/utils/db";


await connect();
export const GET = async (request) => {
  try {
    const ratecoin = await RateCoin.find();
    console.log('rate' , ratecoin);
    return new NextResponse(JSON.stringify(ratecoin), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error!", { status: 500 });
  }
};
