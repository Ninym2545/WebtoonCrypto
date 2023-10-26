import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const {Schema} = mongoose

mongoose.set('strictQuery', false);
const followSchema = new Schema({
    user_id:{
        type: ObjectId,
        ref: 'users',
        required: true,
    },
    content_id:{
        type: ObjectId,
        ref: 'contents',
        required: true,
    },
    status:{
        type: Boolean,
        default: false,
    }
},{timestamps: true}
);

export default mongoose.models.Follow || mongoose.model("Follow", followSchema);