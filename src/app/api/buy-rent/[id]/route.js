import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Buy_Rent from "../../../../models/Buy-rent";



await connect();
export const GET = async (request , {params}) => {
    const {id} = params;
  try {
    const historys = await Buy_Rent.find({
        id_creater: id
    })

    
    return new NextResponse(JSON.stringify(historys), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error!", { status: 500 });
  }
};