import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const postSchema=new Schema(
    {
        postFile:{
            type:String,
            required:true,
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        title:{
            type:String,
            required:true,
        },
        description:{
            type:String,
            default:"",
        
        },
        views:{
            type:Number,
            default:0,
            // required:true,
        },
        isPublished:{
            type:Boolean,
            default:true,
        }



        
    },
    {
        timestamps:true
     } 

)


postSchema.plugin(mongooseAggregatePaginate)

export const Post=mongoose.model('Post',postSchema)
