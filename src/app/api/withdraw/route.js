"use server";
import { NextResponse } from "next/server";
import connect from "@/utils/db";
import User from "../../../models/User";
import WithDraw from "../../../models/Withdraw";

await connect();
export const GET = async (request) => {
  try {
    const chapter = await WithDraw.find();
    console.log('withdraw' , chapter);
    return new NextResponse(JSON.stringify(chapter), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error!", { status: 500 });
  }
};

export const POST = async (require) => {
  try {
    const {  Wallet,Coin,user_id } = await require.json();
    console.log('Wallet', Wallet);
    console.log('Coin', Coin );
    console.log('user_id', user_id);

     // Create a new Buy_Rent document
     const createWithdraw = new WithDraw({
        user_id: user_id,
        wallet_id: Wallet,
        cash: Coin,
      });
      console.log('createWithdraw ---> ', createWithdraw);
        await createWithdraw.save();

    return new NextResponse(JSON.stringify(createWithdraw), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(error.message, {
      status: 500,
    });
  }
};
