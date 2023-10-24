import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const {Schema} = mongoose

mongoose.set('strictQuery', false);
const historySchema = new Schema({
    user_id:{
        type: ObjectId,
        ref: 'users',
        required: true,
    },
    user_name:{
        type: String,
        required: true,
    },
    coin:{
        type: Number,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    txHash:{
        type: String
    },
},{timestamps: true}
);

export default mongoose.models.History || mongoose.model("History", historySchema);