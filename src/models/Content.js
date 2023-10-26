import mongoose from "mongoose";
import { ObjectId } from "mongodb";
const {Schema} = mongoose

const WebtoonSchema = new Schema({
    title:{
        type: String,
        unique: true,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    desc:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    status:{
        type: String,
        default: "ยังไม่จบ"
    },
    day:{
        type: String,
        required: true
    },
    poster:{
        type: String,
        required: true
    },
    background:{
        type: String,
        required: true
    },
    logo:{
        type: String,
        required: true
    },
    poster_deatils:{
        type: String,
        required: true
    },
    id_creater:{
        type: ObjectId,
        required: true
    },
    creater_name:{
        type: String,
        required: true
    },chapter:[{
        title:{
            type: String,
            required: true
        },
        index:{
            type: Number,
            required: true
        },
        img:{
            type: String,
            required: true
        },
        date_upload:{
            type : String, 
            default: Date
        },
        upload:{
            type : Boolean, 
            default: false
        },
        data_img:[{
            name:{
                type: String, 
            },
            url:{
                type: String,
            },
        }]
    }]
    
}
);



//  clientSchema.pre('remove', function(next) {
//     // 'this' is the client being removed. Provide callbacks here if you want
//     // to be notified of the calls' result.
//     Sweepstakes.remove({client_id: this._id}).exec();
//     Submission.remove({client_id: this._id}).exec();
//     next();
// });

export default mongoose.models.Content || mongoose.model("Content", WebtoonSchema);

