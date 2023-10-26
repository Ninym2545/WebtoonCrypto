import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Buy_Rent from "../../../../models/Buy-rent";



export const GET = async (request , {params}) => {
    const {id} = params;
  try {
    await connect();
    const historys = await Buy_Rent.find({
        id_creater: id
    })


    return new NextResponse(JSON.stringify(historys), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error!", { status: 500 });
  }
};