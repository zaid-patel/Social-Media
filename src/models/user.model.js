import mongoose,{Schema} from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'  


const userSchema=new Schema(
    {
        username:{
             type:String,
             required:true,
             index:true,
             trim:true,
             unique:true,
             lowercase:true,
        },
        email:{
            type:String,
            required:true,
            trim:true,
            unique:true,
            lowercase:true,
        },
        fullname:{
            type:String,
            required:true,
            index:true,
            trim:true,
        },
        avatar:{
            type:String,
            required:true,
        },
        coverImage:{
            type:String
        },
        watchHistory:[
            {
                type:Schema.Types.ObjectId,
                ref:"Post",
            }
        ],
        password:{
            type:String,
            required:true,
        },
        refreshToken:{
            type:String,
        }



        
    },
    {
        timestamps:true,
    }
)

userSchema.pre('save', async function(next){
   if(this.isModified('password')){
     this.password=await bcrypt.hash(this.password,10)
     next()
   }
})

userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
   
}

userSchema.methods.accesstokenGenrator=async function(){
    console.log(this.username)
    return await  jwt.sign(
        {
            id:this._id,
           username: this.username,
           fullname: this.fullname,
            email:this.email,
        },process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}



userSchema.methods.refreshtokenGenrator=async function(){
    // console.log(user)
    return await jwt.sign(
        {
            id:this._id,
        },process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User=mongoose.model("User",userSchema)