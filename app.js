import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import { errorMiddleware } from "./middlewares/error.js";
import { connectDB } from "./utils/features.js";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from 'cors'

import { CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE, NEW_MESSAGE_ALERT, ONLINE_USERS, START_TYPING, STOP_TYPING } from "./constants/event.js";
import {v4 as uuid} from "uuid"
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/message.js";
import {v2 as cloudinary} from "cloudinary"
import { corsOptions } from "./constants/config.js";
import { socketAuthenticator } from "./middlewares/auth.js";


import userRoute from "./routes/user.js";
import chatRoute from "./routes/chat.js";
import adminRoute from "./routes/admin.js";


dotenv.config({
	path:"./.env",
})
const mongoURI=process.env.MONGO_URI;
const port=process.env.PORT||3000;

 const adminSecretKey=process.env.ADMIN_SECRET_KEY||"RAJEEV";
 const envMode=process.env.NODE_ENV.trim()||"PRODUCTION";

const userSocketIDs=new Map();//currently active members
const onlineUsers=new Set();
const setHeaders = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
};
connectDB(mongoURI);

cloudinary.config({
	cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
	api_key:process.env.CLOUDINARY_API_KEY,
	api_secret:process.env.CLOUDINARY_API_SECRET,
})

const app=express();
app.use(cors({
	origin : "https://chatapp-frontend-gamma.vercel.app"
}))
const server=createServer(app)
const io= new Server(server,
	{
	cors:{
		origin : "https://chatapp-frontend-gamma.vercel.app",
		credentials:true,
}
}
)

// using middleware here
app.use(express.json())
app.use(cookieParser())


app.set("io",io);

app.use(setHeaders);

app.use("/api/v1/user",userRoute);

app.use("/api/v1/chat",chatRoute);

app.use("/api/v1/admin",adminRoute)

app.get("/",(req,res)=>{
	res.send("welocme to HOME");
})

io.use((socket,next)=>{
	cookieParser()(
		socket.request,
		socket.request.res,
		async(err)=>await socketAuthenticator(err,socket,next)
	)
})

io.on("connection",(socket)=>{

	const user=socket.user;

	userSocketIDs.set(user._id.toString(),socket.id)

	socket.on(NEW_MESSAGE,async({chatId,members,message})=>{
		const messageForRealTime={
			content:message,
			_id:uuid(),
			sender:{
				_id:user._id,
				name:user.name,
			},
			chat:chatId,
			createdAt:new Date().toISOString(),
		}
		
		const messageForDB={
			content:message,
			sender:user._id,
			chat:chatId,
		};

		const membersSocket=getSockets(members);//peoples we want to send the message

		io.to(membersSocket).emit(NEW_MESSAGE,{chatId,message:messageForRealTime});
		io.to(membersSocket).emit(NEW_MESSAGE_ALERT,{chatId})
		
try{
	await Message.create(messageForDB);
}catch(error)
{
	throw new Error(error);
}

	})

	socket.on(START_TYPING,({members,chatId})=>{
		const membersSockets=getSockets(members);
		socket.to(membersSockets).emit(START_TYPING,{chatId})
	})

	socket.on(STOP_TYPING,({members,chatId})=>{
		const membersSockets=getSockets(members);
		socket.to(membersSockets).emit(STOP_TYPING,{chatId})
	})

	socket.on(CHAT_JOINED,({userId,members})=>{
		onlineUsers.add(userId.toString());
		const membersSocket=getSockets(members);
		io.to(membersSocket).emit(ONLINE_USERS,Array.from(onlineUsers));
	})
	socket.on(CHAT_LEAVED,({userId,members})=>{
		onlineUsers.delete(userId.toString());
		const membersSocket=getSockets(members);
		io.to(membersSocket).emit(ONLINE_USERS,Array.from(onlineUsers));

	})

	socket.on("disconnect",()=>{
		
		userSocketIDs.delete(user._id.toString());//active user when disconnected it remove from the userSocketIDs
		onlineUsers.delete(user._id.toString());
		socket.broadcast.emit(ONLINE_USERS,Array.from(onlineUsers));
	})

})

app.use(errorMiddleware);

server.listen(port,()=>{
	console.log(`server is running on port ${port} IN ${envMode} Mode`);
})


export { adminSecretKey, envMode, userSocketIDs};
