import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApirError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'  ;



export const verfiyJwt=asyncHandler(async(req, _,next)=>{
    const token=req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer","")
    const rtoken=req.cookies?.refreshtoken 

    // console.log(token===rtoken)
    // console.log(rtoken)
    if(!token){
        throw new ApiError(401,"Unauthorized request")
    }
    const response=jwt.decode(token,process.env.ACCESS_TOKEN_SECRET)
    //  console.log(response)
    const user=await User.findById(response?.id).select("-password -refreshToken")
    // console.log(user)
    if(!user) throw new ApiError(401,"invalid token")


    req.user=user
    next()


})