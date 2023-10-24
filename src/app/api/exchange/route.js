"use server";
import { NextResponse } from "next/server";
import connect from "@/utils/db";
import User from "../../../models/User";
import Exchange from '../../../models/Exchange';


export const GET = async (request) => {
    try {
      await connect();
      const chapter = await Exchange.find();
  
      return new NextResponse(JSON.stringify(chapter), { status: 200 });
    } catch (err) {
      return new NextResponse("Database Error!", { status: 500 });
    }
  };

export const POST = async (require) => {
    try {
      const { index , user_id ,user_name} = await require.json();

     
        const createExchange = new Exchange({
            user_id: user_id,
            user_name: user_name,
            coin: index.rate,
            ticket: index.ticker,
            type: index.type
          });
        
          await createExchange.save();

         const updateuser = await User.findOneAndUpdate(
            {
              _id: user_id,
            },
            {
                $inc: { coin: -index.rate , 
                        ticker_rent: index.ticker},
            }
          );

        
      return new NextResponse(
        JSON.stringify(createExchange),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error(error);
      return new NextResponse(error.message, {
        status: 500,
      });
    }
  };
export const PUT = async (require) => {
    try {
      const { index , user_id ,user_name} = await require.json();

     
        const createExchange = new Exchange({
            user_id: user_id,
            user_name: user_name,
            coin: index.rate,
            ticket: index.ticker,
            type: index.type
          });
        
          await createExchange.save();

         const updateuser = await User.findOneAndUpdate(
            {
              _id: user_id,
            },
            {
                $inc: { coin: -index.rate , 
                    ticker_buy: index.ticker},
            }
          );

        
      return new NextResponse(
        JSON.stringify(createExchange),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error(error);
      return new NextResponse(error.message, {
        status: 500,
      });
    }
  };