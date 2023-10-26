import { NextResponse } from "next/server";
import connect from "@/utils/db";
import WithDraw from "../../../../models/Withdraw";



export const GET = async (request , {params}) => {
    const {id} = params;
  try {
    await connect();
    const historys = await WithDraw.find({
        user_id: id
    })


    return new NextResponse(JSON.stringify(historys), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error!", { status: 500 });
  }
};