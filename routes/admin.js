import express from "express"
import { adminLogin, adminLogout, allChats, allMessages, allUsers, getDashboardStats, verifyAdmin } from "../lib/controllers/admin.js"
import { adminLoginValidator, validateHandler } from "../lib/validators.js"
import { isAdmin } from "../middlewares/auth.js"

const app=express.Router()


app.post("/verify",adminLoginValidator(),validateHandler,adminLogin)

app.get("/logout",adminLogout)

// only admin can access these routes

app.use(isAdmin)
app.get("/",verifyAdmin)

app.get("/users",allUsers)

app.get("/chats",allChats)

app.get("/messages",allMessages)

app.get("/stats",getDashboardStats);


export default app