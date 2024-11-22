import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app=express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))
app.use(express.json({limit:'16kb'}))
app.use(express.static('public'))
app.use(express.urlencoded({extended:true,limit:'16kb'}))
app.use(cookieParser());


import { userRouter } from './routes/user.routes.js'
import { postRouter} from './routes/post.routes.js'
import messageRouter from './routes/messages.routes.js'
// import { router } from './routes/comment.routes.js'
// import { subsRouter } from './routes/subscription.routes.js'

app.use('/api/v1/users',userRouter)
app.use('/api/v1/posts',postRouter)
app.use('/api/v1/chat',messageRouter)



export {app}