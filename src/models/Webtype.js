import { Double, ObjectId } from "mongodb";
import mongoose from "mongoose";

const {Schema} = mongoose

const WebtypeSchema = new Schema({
    category: {
        en: { type: String, required: true },
        th: { type: String, required: true }
      }
}
);

export default mongoose.models.Category || mongoose.model("Category", WebtypeSchema);