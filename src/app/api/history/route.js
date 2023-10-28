import { NextResponse } from "next/server";

import connect from "@/utils/db";
import history from "@/models/history";


await connect();
export const GET = async (request) => {
  try {
    const historys = await history.find();
    console.log('history' , history);
    return new NextResponse(JSON.stringify(historys), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error!", { status: 500 });
  }
};
