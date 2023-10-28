
import User from "../../../../models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import connect from "@/utils/db";


// export const POST = async (request) => {
//   try {
//     await connect();
//     const { name, email, password  } = await request.json();

//     const user = await User.findOne({
//       email: email 
//     });

//     if(user) {
//       return new NextResponse(error.message, {
//         status: 500,
//       });
//     }
//     const pass = await bcrypt.hash(password , 12)


//     const userExist = await User.findOne({
//       email: email
//     })

//      if(userExist){
//        const newUser = new User({name: name, email: email, password: pass})
//        await newUser.save();

//      }

//     return new NextResponse("User has been created", {
//       status: 201,
//     });

//   } catch (error) {
//     console.log(error);
//     return new NextResponse(error.message, {
//       status: 500,
//     });
//   }
// };

export const POST = async (request) => {
  try {

    const { name, email, password  } = await request.json();
    await connect();

    const user = await User.findOne({
      email: email 
    });
    if(user){
      return new NextResponse(err.message, {
        status: 500,
      });
    }else{
      const hashedPassword = await bcrypt.hash(password, 5);
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });
      await newUser.save();
      console.log("User has been created");
      return new NextResponse("User has been created", {
        status: 201,
      });
    }

  } catch (err) {
    console.log("err: ",err);
    return new NextResponse(err.message, {
      status: 500,
    });
  }
};