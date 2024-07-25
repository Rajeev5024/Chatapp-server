import express from "express";

import { isAuthenticated } from "../middlewares/auth.js";
import {addMembers, deleteChat, getChatDetails, getMessages, getMyChats, getMyGroups, leaveGroup, newGroupChat, removeMembers, renameGroup, sendAttachments}  from "../lib/controllers/chat.js";
import { attachmentsMulter } from "../middlewares/multer.js";
import { addMembersValidator, getChatIdValidator,newGroupChatValidator, removeMembersValidator, renameGroupValidator, sendAttachmentsValidator, validateHandler } from "../lib/validators.js";

const app=express.Router();

app.use(isAuthenticated);

app.post("/new",newGroupChatValidator(),validateHandler,newGroupChat);

app.get("/my",getMyChats);

app.get("/my/groups",getMyGroups);

app.put("/addmembers",addMembersValidator(),validateHandler,addMembers)

app.put("/removemembers",removeMembersValidator(),validateHandler,removeMembers)

app.delete("/leave/:id",getChatIdValidator(),validateHandler,leaveGroup)

app.post("/message",attachmentsMulter,sendAttachmentsValidator(),validateHandler,sendAttachments)

app.get("/message/:id",getChatIdValidator(),validateHandler,getMessages)

app.route("/:id")
.get(getChatIdValidator(),validateHandler,getChatDetails)
.put(renameGroupValidator(),validateHandler,renameGroup)
.delete(getChatIdValidator(),validateHandler,deleteChat);



export default app;