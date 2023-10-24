import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const {Schema} = mongoose

mongoose.set('strictQuery', false);
const buy_renrSchema = new Schema({
    user_id:{
        type: ObjectId,
        ref: 'users',
        required: true,
    },
    user_name:{
        type: String,
        required: true,
    },
    content_id:{
        type: ObjectId,
        ref: 'contetnts',
        required: true,
    },
    content_name:{
        type: String,
        required: true,
    },
    chapter_id:{
        type: ObjectId,
        ref: 'contetnts',
        required: true,
    },
    chapter_name:{
        type: String,
        required: true,
    },
    type:{
        type: String,
        required: true,
    },
},{timestamps: true}
);

export default mongoose.models.Buy_Rent || mongoose.model("Buy_Rent", buy_renrSchema);