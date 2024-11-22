import { Comment } from "../models/comment.model.js";
import { User } from "../models/user.model.js";
import {Post} from "../models/post.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApirError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose"



const getPostComments=asyncHandler(async (req,res)=>{
    const {post_id}=req.query
    // console.log(req.body)
    const {page = 1, limit = 10} = req.query
    if(!post_id) throw new ApiError(400,"post_id is req.")

    const post=await Post.findById(post_id);
    if(!post) throw new ApiError(404,"no post with id found")

    const comments=await Comment.aggregate(
        [
           {
             $match:{
                post:new mongoose.Types.ObjectId(post_id)
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
           
        ]
    )
     console.log(comments)
    return res.status(200).json(
       new ApiResponse(200,comments,"comments retrieved succ.")
    )

})


const addComment=asyncHandler(async(req,res)=>{
    const {content,postId}=req.body
    console.log(content)
    // console.log(req.params)
    if(!content || !postId) throw new ApiError(400,"all fields are neccessary")
    const owner_id=req.user._id 
    // const onwer=await User.findById(owner_id)

    const post=await Post.findById(postId)

    if(!post) throw new ApiError(400,"no post with the id provided found")

    const comment=await Comment.create(
        {
            content,
            post:postId,
            owner:owner_id, 
        }
    )

    if(!comment) throw new ApiError(500,"internal server err")

    return res.status(200).json(
        new ApiResponse(200,comment,"comment added succ.")
    )
})


const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {id}=req.params
    console.log(id);
    
    if(!id){
        throw new ApiError(400,"No comment id ")

    }
    try {
        
        const res1=await Comment.findByIdAndDelete(id)

        return res.status(200).json(new ApiResponse(200,res1,"comment deleted succ."))
    } catch (error) {
         throw new ApiError(500,error.message)
    }
})



export {
    addComment,
    getPostComments,
    deleteComment,
}