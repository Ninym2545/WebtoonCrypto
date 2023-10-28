import { NextResponse } from "next/server";

import connect from "@/utils/db";
import history from "@/models/history";


await connect();
export const GET = async (request , {params}) => {
    const {id} = params;
  try {
    const historys = await history.find({
        user_id: id
    })


    return new NextResponse(JSON.stringify(historys), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error!", { status: 500 });
  }
};