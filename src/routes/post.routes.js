import { Router } from "express";
import { upload } from "../middlewares/multer.js";
import { verfiyJwt } from "../middlewares/auth.middleware.js";
import { router as commentRouter} from "./comment.routes.js";
import { addAPost, deletePost, getAllPosts, getAPost } from "../controllers/post.controller.js";

const postRouter=Router()

postRouter.use(verfiyJwt)

postRouter.route("/addpost").post(
     upload.fields([
        {
            name:"postFile",
            maxCount:1,
        },
     ])
    ,addAPost)


    postRouter.route("/all").get(getAllPosts)

    postRouter.route("/:postId").get(getAPost)
    
    postRouter.route("/:post_id").delete(deletePost)

    postRouter.use("/:post_id/comments/",commentRouter)


    export {postRouter}