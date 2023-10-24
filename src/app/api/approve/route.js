"use server";
import { NextResponse } from "next/server";

import path, { resolve } from "path";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import os from "os";
import cloudinary from "cloudinary";
import { revalidatePath } from "next/cache";
import Contents from "@/models/Content";
import connect from "@/utils/db";
import User from "../../../models/User";
import Evidence from '../../../models/Evidence'


export const POST = async (require) => {
  try {
    const { _id } = await require.json();

    // Find the user by _id and update the role
    const updateuser = await User.findByIdAndUpdate(
      _id,
      { role: 'creator' },
      { new: true } // To get the updated document as the result
    );

    // Find the evidence by user_id and update the status
    const updateevidence = await Evidence.findOneAndUpdate(
      { user_id: _id },
      { status: 'creator' },
      { new: true } // To get the updated document as the result
    );

    console.log('Updated user:', updateuser);
    console.log('Updated evidence:', updateevidence);

    // Return the updated data in the response
    return new NextResponse(
      JSON.stringify({ data: updateuser, evidence: updateevidence }),
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

