import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import {v4 as uuid} from "uuid"
import {v2 as cloudinary} from "cloudinary"
import { getBase64, getSockets } from "../lib/helper.js"
import { NEW_MESSAGE } from "../constants/event.js"



const cookieOptions={
	maxAge:1000*60*60*24*15,
	sameSite:"none",
	httpOnly:true,
	secure:true,
}

const connectDB=(uri)=>{
	mongoose.connect(uri,{dbName:"Chatapp"})
	.then((data)=>{console.log(`conneted to DB: ${data.connection.host}`)})
	.catch((err)=>{
		throw err;
	})
}


const sendToken=(res,user,code,message)=>{
	const token=jwt.sign({_id:user._id},process.env.JWT_SECRET);

	return res.status(code).cookie("Chatapp-token",token,cookieOptions).json({
		success:true,user,
		message,
	})
}

const emitEvent= (req,event,users,data)=>{
	const io=req.app.get("io");
	const userSocket=getSockets(users);
	io.to(userSocket).emit(event,data)
}

const uploadFilesToCloudinary=async (files=[])=>{
		const uploadPromises=files.map((file)=>{
			return new Promise((resolve,reject)=>{
				cloudinary.uploader.upload(getBase64(file),{resource_type:"auto",public_id:uuid()},(error,result)=>{
					if(error) return reject(error);
					resolve(result);
				})
			})
		})

		try {
			const results=await Promise.all(uploadPromises);
			const formattedResults=results.map((result)=>({
				public_id:result.public_id,
				url:result.secure_url,
			}))
			return formattedResults;
		} catch (error) {
			throw new Error("Error uploading files to cloudinary",error);
		}
}

const deleteFilesFromCloudinary=async (public_ids)=>{
	//Delte files from cloudnary
}

export {
	connectDB,
	sendToken,
	cookieOptions,
	emitEvent,
	deleteFilesFromCloudinary,
	uploadFilesToCloudinary,
}


