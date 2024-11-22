import mongoose from "mongoose";
import { Message } from "../models/message.model.js";  // Assuming you have a Message model
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApirError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Add a new message
const addMessage = asyncHandler(async (req, res) => {
    const { content, receiverId} = req.body;
    const senderId=req.user?._id;

     if (!content || !receiverId || !senderId) {
        throw new ApiError(400, "Content, receiverId, and senderId are required");
    }

    // Create a new message
    const newMessage = new Message({
        content,
        sender: senderId,
        receiver: receiverId,
    });

    try {
        // Save the new message to the database
        await newMessage.save();

        // Return the newly created message
        return res.status(201).json(
            new ApiResponse(200, newMessage, "Message sent successfully")
        );
    } catch (error) {
        throw new ApiError(500, error.message);
    }
});

// Get all messages between two users
const getAllMessages = asyncHandler(async (req, res) => {
    const {  receiverId } = req.query;
    const receiverId1=new mongoose.Types.ObjectId(receiverId);
    const senderId=req.user?._id;
    console.log(senderId);
    console.log(receiverId1);
    
    
    if (!senderId || !receiverId1) {
        throw new ApiError(400, "Both senderId and receiverId are required");
    }

    try {
        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId1 },
                { sender: receiverId1, receiver: senderId },
            ],
        })
            .populate("sender", "username avatar")  // Populate sender details
            .populate("receiver", "username avatar")  // Populate receiver details
            .sort({ createdAt: 1 });  // Sort messages by creation date (ascending)

        return res.status(200).json(
            new ApiResponse(200, messages, "Messages fetched successfully")
        );
    } catch (error) {
        throw new ApiError(500, error.message);
    }
});

export { addMessage, getAllMessages };
