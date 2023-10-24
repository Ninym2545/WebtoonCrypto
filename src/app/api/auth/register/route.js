
import User from "../../../../models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import connect from "@/utils/db";

const BASE_URL = process.env.NEXTAUTH_URL;

export const POST = async (request) => {
  try {
    await connect();
    const { name, email, password  } = await request.json();

    const user = await User.findOne({
      email: email 
    });

    if(user) {
      return new NextResponse(error.message, {
        status: 500,
      });
    }
    const pass = await bcrypt.hash(password , 12)


    const userExist = await User.findOne({
      email: email
    })

     if(userExist) return {message: 'Verify Success!'}

     const newUser = new User({name: name, email: email, password: pass})


     await newUser.save();

    return new NextResponse("User has been created", {
      status: 201,
    });

  } catch (error) {
    console.log(error);
    return new NextResponse(error.message, {
      status: 500,
    });
  }
};
