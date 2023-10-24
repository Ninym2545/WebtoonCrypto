
import mongoose from "mongoose";

const {Schema} = mongoose

mongoose.set('strictQuery', false);
const RateSchema = new Schema({
    coin:{
        type: Number,
        unique: true,
        required: true,
    },
    price:{
        type: Number,
        unique: true,
        required: true,
    }
}
);

export default mongoose.models.Rate || mongoose.model("Rate", RateSchema);