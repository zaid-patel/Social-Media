import mongoose from "mongoose"
import { Post } from "../models/post.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApirError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { User } from "../models/user.model.js"






     const getAllPosts = asyncHandler(async (req, res) => {
        // query ->title/channel name me dhundega 
       let { page = 1, limit = 10, query, userId } = req.query


       if(!userId && !query){
         query="homepage";
       }
    //    console.log(query)
       let posts
      try {
        
        //  console.log(query + userId);
         
         if(query=="homepage")
         posts=await Post.find({title:{$regex:"",$options:"i"}}).limit(limit).skip((page-1)*limit)

         else if(userId){
            // console.log(123)
          posts=await Post.find({owner:userId})
        // console.log(1234) 
        }
         else {
            posts=await Post.find({title:{$regex:query,$options:"i"}}).limit(limit).skip((page-1)*limit)

         }

         return res.status(200).json(
            new ApiResponse(200,posts,"posts fetched successfully")
         )

      } catch (error) {
        throw new ApiError(500,error.message)
      }



       
    })
// multer middleware 
   
    
    const addAPost = asyncHandler(async (req, res) => {
        try {
        // take data from frontend and post and thumbnail
        // upload post and thumbnail on cloudinary 
        // make a post model object ,add onwer ,duration, etc 
        // return teh post 
    
    
        const { title, description} = req.body
        // const owner=await User.findById(req.user._id)
    //    console.log(req.files)
    
        const postFileLocalPath = req.files?.postFile[0]?.path;
    
        if(!postFileLocalPath){
            throw new ApiError(407,"post and thumbnail are required")
        }
    
        const postFile=await uploadOnCloudinary(postFileLocalPath)
    
        if(!postFile){
            throw new ApiError(500,"internal server error | cloudinary upload error")
        }
    //   try
        const post=await Post.create(
            {
                postFile:postFile.url,
                owner:req.user._id,
                title,
                description,
                
            }
        )
    
        if(!post) throw new ApiError(500,"internal server error while adding  post to db")
    
    
        const createdPost = await Post.findById(post._id)
    
        if(!createdPost) throw new ApiError(500,"internal server error | cant find the post")
    
        return res.status(200).json(
            new ApiResponse(200,createdPost,"post added successfully!")
        )
    
    
    } catch (error) {
        console.log(error.message)
    }
    
    })


   const getAPost=asyncHandler(async(req,res)=>{
    
      const {postId}=req.params;
      console.log(req.params.postId)
      if(!postId) throw new ApiError(400,"post id is required")
      await Post.findByIdAndUpdate(postId,{
        $inc:{views:1}
      })
      const user=await User.findById(req.user?._id)
      if(user && !user. watchHistory?.includes(postId)){
         user.watchHistory.push(postId)
         await user.save()
      }
      
      const post= await Post.aggregate([
          {
            $match:{
                _id:new mongoose.Types.ObjectId(postId)
            }
          },
          
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
          },
          {
            
            $set:
            {
            owner:{
                    $first:"$owner",
                }
            }
          }
         
      ])
      
      if(!post) throw new ApiError(404,"No post with id found")
      console.log(123)
     console.log(post)
     
        res.status(200).json(
            new ApiResponse(200,post,"post fetched succ.")
        )

   })
    

   const deletePost=asyncHandler(async(req,res)=>{
     const {post_id}=req.params;
     console.log(post_id);
     const post=await Post.findById(post_id)
     if(!post) throw new ApiError(400,"post with given id not found")
     const res1=await Post.findByIdAndDelete(post_id)
    const res2=await Post.findById(post_id)
     console.log(res2+" worr");
      res.status(200).json(new ApiResponse(200,res2,"succ."));
     
   })



export {
    addAPost,
    getAPost,
    getAllPosts,
    deletePost
}