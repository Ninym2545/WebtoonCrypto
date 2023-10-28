"use server";
import { NextResponse } from "next/server";
import Withdraw from "@/models/Withdraw";
import axios from "axios";
import { withdraw as ethersWithdraw } from "../ethers/ethers.service";
import connectDB from "@/utils/db";

await connectDB()
export const POST = async (require) => {
  try {
    const { _id } = await require.json();

    const withdraws = await Withdraw.findById(_id);
    console.log("id ---> ", withdraws);

    if (!withdraws) {
      return new NextResponse("Withdraw not found", {
        status: 404,
      });
    }

    const cash = withdraws.cash;
    const result = cash / 100; // Convert to Bath
    // console.log("cash", result);

    const busdRate = await axios.get(
      "https://min-api.cryptocompare.com/data/price?fsym=BUSD&tsyms=THB"
    );
    const rate = (1 * 10 ** 18) / busdRate.data.THB;
    const toWei = rate * result;
    const wallet_id = withdraws.wallet_id;
    
    let updateuser
    const res = await ethersWithdraw(wallet_id, toWei);
    if(res){
        updateuser = await Withdraw.findByIdAndUpdate(
            _id,
            { status: 'Complete' ,
            transaction: res },
            { new: true } // To get the updated document as the result
          );
      
    }
    console.log('update --> ', updateuser);
    return new NextResponse(JSON.stringify(updateuser), {
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
