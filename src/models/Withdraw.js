import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const {Schema} = mongoose

mongoose.set('strictQuery', false);
const WithDrawSchema = new Schema({
    user_id:{
        type: ObjectId,
        ref: 'users',
        required: true,
    },
    wallet_id:{
        type: String,
        required: true,
    },
    cash:{
        type: Number,
        required: true,
    },
    transaction:{
        type: String,
    },
    status:{
        type: String,
        default: 'Prending'
    }
},{timestamps: true}
);

export default mongoose.models.WithDraw || mongoose.model("WithDraw", WithDrawSchema);