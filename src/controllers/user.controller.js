import mongoose, { set } from "mongoose";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApirError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from 'jsonwebtoken'  ;



const options={
    httpOnly:true,
    secure:true,
}
const genrateAcessandRefreshToken=async (passeduser)=>{

   try {
    // console.log(user)
    const user=await User.findById(passeduser._id)
     const accesstoken=await user.accesstokenGenrator()
     const refreshtoken=await user.refreshtokenGenrator()
 
     user.refreshToken=refreshtoken
     await user.save({validateBeforeSave:false})
     return {accesstoken,refreshtoken}
   } catch (error) {
     throw new ApiError(500,error.message)
    
   }
}
const register=asyncHandler(async(req,res)=>{
    // console.log('noober')
    const {fullname,username,password,email}=req.body
console.log(1111);

    if( fullname==="" || username ==="" || email ==="" || password ===""){
        throw new ApiError(409,"All fields are req.")
    }

    if(
        await User.findOne({
            $or:[{username},{email}]
        })
    ){
        throw new ApiError(409,"User exists with the email or username")
    }
    // console.log(req.files)
    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }
    // console.log(avatarLocalPath)
    const avatar=await uploadOnCloudinary(avatarLocalPath)  // await exclusively again used as we need to wait here eventhough the whole fn is in a promise
    const  coverImage=coverImageLocalPath? await uploadOnCloudinary(coverImageLocalPath):null
    if(!avatar){
         throw new ApiError(500,"internal server error when uploading avatar")
    }
    const user=await User.create(
        {
            fullname,
            username,
            email,
            password,
            avatar:avatar.url,
            coverImage:coverImage?.url || ""
              
        }
    )
    
    const createdUser=await User.findById(user._id).select("-password -refreshToken")
    if(!createdUser){
        throw new ApiError(500,"could not create the user")
    }
     return res.status(201).json(
        new ApiResponse(200,createdUser,"registered ")
     )
})

const login=asyncHandler(async(req,res)=>{

    const {password,email}=req.body
    
    console.log(password)  
    // console.log(req.body)
    const user=await User.findOne({
            $or:[{email},{email}]
        })
    if(!user){
        // console.log(user)
        throw new ApiError(409,"no user with email or username exists")
    }
    if(await user.isPasswordCorrect(password)){
        const {refreshtoken,accesstoken}=await genrateAcessandRefreshToken(user)
        //const refreshtoken=await user.refreshtokenGenrator()
        // user.refreshtoken=refreshtoken
        const loggedinUser=await User.findById(user._id).select("-password -refreshToken")


        return res.status(200)
        .cookie("accesstoken",accesstoken,options)
        .cookie("refreshtoken",refreshtoken,options)
        .json(
            new ApiResponse(200,
            {
                user:loggedinUser,
                accesstoken,
                refreshtoken,
            },
            " user loggedin successfully",
            ))
        

    }else{
        throw new ApiError(408,"password incorrect")
    }
    
})

const logout=asyncHandler(async(req,res)=>{
    // const loggedinUser=req.user
    const user=await User.findByIdAndUpdate(req.user._id,
    {
        $set:{
            refreshToken:undefined
        }
    },
    {
        new:true
    }
    )
    // user.refreshToken=""
    // await user.save({validateBeforeSave:false})

    return res.status(200).cookie("accesstoken","",options)
    .cookie("refreshtoken","",options)
    .json(
        new ApiResponse(200,
        {},
        "user logged out successfully",
    ))

})

const updateUser=asyncHandler(async(req,res)=>{
    const {fullname,email}=req.body
    console.log(fullnma,email)
    if(!fullname || !email){
        throw new ApiError(400,"username and fullname req")

    }
    // const user=await user.findByIdAndUpdate(req.user._id)
})

const refreshAccessToken=asyncHandler(async(req,res)=>{
    const refreshtoken=req.cookies?.refreshtoken 
    // || req.header("Authorization")?.replace("Bearer","")

    if(!refreshtoken){
        throw new ApiError(401,"Unauthorized request")
    }
    const response=jwt.decode(refreshtoken,process.env.REFRESH_TOKEN_SECRET)
    const user=await User.findById(response?.id)

    const accesstoken=await user.accesstokenGenrator()
    const loggedinUser=await User.findById(user._id).select("-password -refreshToken")
    //  console.log(refreshtoken===accesstoken)
    //  console.log(accesstoken)
    return res.status(200)
    .cookie("accesstoken",accesstoken,options)
    .cookie("refreshtoken",refreshtoken,options)
    .json(
        new ApiResponse(200,
        {
            user:loggedinUser,
            accesstoken,
            refreshtoken,
        },
        " access token refreshed successfully",
        ))


}) 



const getUserWatchHistory=asyncHandler(async(req,res)=>{
    const {userId}=req.params
    if(!userId) throw new ApiError(400,"user id is reqiired")
    const user=await User.findById(userId)
    if(!user) throw new ApiError(400,"no user with userId")
    try {
        const posts=await User.aggregate([
             {
               $match:{
                 _id:user._id
               }  
             },
             {
               $lookup:{
                // reasoning of posts and not post
                 from:"posts",
                 localField:"watchHistory",
                 foreignField:"_id",
                 as:"watchHistory",
                 pipeline:[
                    {
                        $lookup:{
                          from:"users",
                          localField:"owner",
                          foreignField:"_id",
                          as:"owner",
                          pipeline:[
                            {
                                $project:{
                                    username:1,
                                    avatar:1,
                                }
                            }
                          ]
                        }
                        
                    }
                    ,
                    {
                    $set:
                    {
                    owner:{
                            $first:"$owner",
                        }
                    }
                  }
                   
                    
                        
                    
                 ]
               }
             },
             
        ])
    //   console.log(posts[1])
        return res.status(200).json(
            new ApiResponse(200,posts,"watch history successfully retrieved!")
        )
    } catch (error) {
        throw new ApiError(500,error.message)

    }
})

//

export {
    register,
    login,
    logout,
    refreshAccessToken,
    getUserWatchHistory,

}