import { NextResponse } from "next/server";

import connect from "@/utils/db";
import history from "@/models/history";


export const GET = async (request) => {
  try {
    await connect();
    const historys = await history.find();

    return new NextResponse(JSON.stringify(historys), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error!", { status: 500 });
  }
};
