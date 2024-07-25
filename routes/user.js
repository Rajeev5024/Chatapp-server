import express from "express"
import { acceptFriendRequest, getMyFriends, getMyNotifications, getMyProfile, login, logout, newUser, searchUser, sendFriendRequest } from "../lib/controllers/user.js";
import { singleAvatar } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { AcceptRequestValidator, loginValidator, registerValidator, SendRequestValidator, validateHandler } from "../lib/validators.js";

const app=express.Router();


app.post("/new",singleAvatar, registerValidator(),validateHandler,newUser)

app.post("/login",loginValidator(),validateHandler,login)

app.use(isAuthenticated);


//After this user must be logges in to access the routes

app.get("/me",getMyProfile);

app.get("/logout",logout)

app.get("/search",searchUser)

app.put("/sendrequest",SendRequestValidator(),validateHandler,sendFriendRequest)

app.put("/acceptrequest",AcceptRequestValidator(),validateHandler,acceptFriendRequest)

app.get("/notifications",getMyNotifications)

app.get("/friends",getMyFriends)

export default app;