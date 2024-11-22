import express from "express";
import { addMessage,getAllMessages } from "../controllers/message.controller.js";
import { verfiyJwt } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(verfiyJwt)
// Route to add a new message
router.post("/message", addMessage);

// Route to get all messages between two users
router.get("/messages", getAllMessages);

export default router;
