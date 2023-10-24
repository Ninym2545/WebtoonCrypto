import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const {Schema} = mongoose

mongoose.set('strictQuery', false);
const evidenceSchema = new Schema({
    user_id:{
        type: ObjectId,
        ref: 'users',
        required: true,
    },
    user_name:{
        type: String,
        required: true,
    },
    tel:{
        type: String,
        required: true,
    },
    Address:{
        type: String,
        required: true,
    },
    Evidence:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        default: "prending"
    },
},{timestamps: true}
);

export default mongoose.models.Evidence || mongoose.model("Evidence", evidenceSchema);