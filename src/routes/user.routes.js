import { Router } from "express";
import {  logout, refreshAccessToken, register as registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.js";
import { verfiyJwt } from "../middlewares/auth.middleware.js";
import { login as loginUser } from "../controllers/user.controller.js";


const userRouter=Router()


userRouter.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    )



userRouter.route("/login").post(loginUser)

userRouter.route("/logout").post(
   verfiyJwt,
   logout,   
)


userRouter.route("/refreshAccessToken").post(refreshAccessToken)

// userRouter.route("/c/:username").get(userProfile)


export {userRouter}