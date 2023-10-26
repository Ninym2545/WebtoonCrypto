import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const {Schema} = mongoose

mongoose.set('strictQuery', false);
const exchangeSchema = new Schema({
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
    ticket:{
        type: Number,
        required: true,
    },
    type:{
        type: String,
        required: true,
    },
},{timestamps: true}
);

export default mongoose.models.Exchange || mongoose.model("Exchange", exchangeSchema);