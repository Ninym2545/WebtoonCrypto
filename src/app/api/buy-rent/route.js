"use server";
import { NextResponse } from "next/server";
import connect from "@/utils/db";
import User from "../../../models/User";
import Buy_Rent from "../../../models/Buy-rent";
import Content from "../../../models/Content";

await connect();
export const GET = async (request) => {
  try {
    const chapter = await Buy_Rent.find();
    console.log('buyrentAll' , chapter);
    return new NextResponse(JSON.stringify(chapter), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error!", { status: 500 });
  }
};

export const POST = async (require) => {
  try {
    // Parse the request JSON
    const { ticker, chapter_id, content_id, user_id } = await require.json();

    // Calculate dueDate based on the ticker
    let dueDate;
    if (ticker === "เช่า") {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 3);
      dueDate = currentDate.toISOString();

      var number = 200;
      var percentage = 40;
      var result = (percentage / 100) * number;
      var sum = number - result;
      console.log("เช่า ---> ", sum);
    } else if (ticker === "ซื้อเก็บ") {
      const currentDate = new Date();
      currentDate.setFullYear(currentDate.getFullYear() + 100);
      dueDate = currentDate.toISOString();

      var number = 400;
      var percentage = 40;
      var result = (percentage / 100) * number;
      var sum = number - result;
      console.log("เช่า ---> ", sum);
    }
    console.log("วันหมดอายุ ---> ", dueDate);

    // Find user and content by their IDs
    const user = await User.findById(user_id);
    const content = await Content.findById(content_id);
    const contentfilter = content.chapter.find(
      (item) => item._id == chapter_id
    );

    // Create a new Buy_Rent document
    const createBuy_Rent = new Buy_Rent({
      user_id: user_id,
      user_name: user.name,
      content_id: content_id,
      content_name: content.title,
      chapter_id: contentfilter._id,
      chapter_name: contentfilter.title,
      id_creater: content.id_creater,
      type: ticker,
      price: sum,
    });
    await createBuy_Rent.save();
    console.log('create ---> ', createBuy_Rent);

    // Update the user document
    user.buyrent.push({
      content_id: content_id,
      chapter_id: contentfilter._id,
      status: ticker,
      exdate: dueDate,
    });

    let updatedUser;
    if (ticker === "ซื้อเก็บ") {
      // Update the user document in the database
      updatedUser = await User.findByIdAndUpdate(
        { _id: user_id },
        {
          $inc: {
            ticker_buy: -1, // Decrement the current value by 1
          },
          $set: {
            buyrent: user.buyrent,
          },
        },
        { new: true }
      );
    } else {
      updatedUser = await User.findByIdAndUpdate(
        { _id: user_id },
        {
          $inc: {
            ticker_rent: -1, // Decrement the current value by 1
          },
          $set: {
            buyrent: user.buyrent,
          },
        },
        { new: true }
      );
    }
    // console.log("update ---> ", updatedUser);
    // Return a JSON response
    return new NextResponse(JSON.stringify(createBuy_Rent), {
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

// export const PUT = async (require) => {
//     try {
//       const { index , user_id ,user_name} = await require.json();

//         const createExchange = new Exchange({
//             user_id: user_id,
//             user_name: user_name,
//             coin: index.rate,
//             ticket: index.ticker,
//             type: index.type
//           });

//           await createExchange.save();

//          const updateuser = await User.findOneAndUpdate(
//             {
//               _id: user_id,
//             },
//             {
//                 $inc: { coin: -index.rate ,
//                     ticker_buy: index.ticker},
//             }
//           );

//       return new NextResponse(
//         JSON.stringify(createExchange),
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//     } catch (error) {
//       console.error(error);
//       return new NextResponse(error.message, {
//         status: 500,
//       });
//     }
//   };
