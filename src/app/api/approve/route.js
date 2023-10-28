
import { NextResponse } from "next/server";
import connect from "@/utils/db";
import User from "../../../models/User";
import Evidence from '../../../models/Evidence'


await connect();
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
    
    const allUsers = await User.find()
     console.log('Updated user:', allUsers);


    // Return the updated data in the response
    return new NextResponse(
      JSON.stringify({ data: allUsers, evidence: updateevidence }),
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

