"use server"
import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Evidence from '../../../models/Evidence'
import { revalidatePath } from "next/cache";


connect();

export const GET = async (request) => {
  try {
    const res = await Evidence.find(); // Fetch evidence data, possibly from a database
    console.log('evidence', res); // Log the evidence data
    return new NextResponse(JSON.stringify(res), { status: 200, cache: 'no-store' }); // Return the evidence data as a JSON response with cache disabled
  } catch (err) {
    return new NextResponse("Database Error!", { status: 500 }); // Handle any database errors with a 500 status response
  }
};




