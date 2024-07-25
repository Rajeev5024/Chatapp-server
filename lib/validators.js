import { body, param, validationResult } from "express-validator";
import { ErrorHandler } from "../utils/utility.js";

const validateHandler=(req,res,next)=>{
	const errors=validationResult(req);

	const errorMessage=errors.array().map((error)=>error.msg).join(",")


	if(errors.isEmpty())return next();
	else next(new ErrorHandler(errorMessage,400))
}

const registerValidator=()=>[
	body("name","Please enter name").notEmpty(),
	body("username","Please enter username").notEmpty(),
	body("bio","Please enter bio").notEmpty(),
	body("password","Please enter password").notEmpty(),
]

const loginValidator=()=>[
	body("username","Please enter username").notEmpty(),
	body("password","Please enter password").notEmpty(),

]

const newGroupChatValidator=()=>[
	body("name","Please enter name").notEmpty(),
	body("members")
	.notEmpty()
	.withMessage("Please enter members")
	.isArray({min:1,max:100})
	.withMessage("members must be 2-100")
]

const addMembersValidator = () => [
	body("chatId", "Please Enter Chat ID").notEmpty(),
	body("members")
	  .notEmpty()
	  .withMessage("Please Enter Members")
	  .isArray({ min: 1, max: 97 })
	  .withMessage("Members must be 1-97"),
  ];
const removeMembersValidator=()=>[
	body("userId","Please enter user ID").notEmpty(),
	body("chatId","Please enter chat ID").notEmpty(),
	
]


const sendAttachmentsValidator=()=>[
	body("chatId","Please enter Chat ID").notEmpty(),
]

const getChatIdValidator=()=>[
	param("id","Please provide attachment").notEmpty()
	
]

const renameGroupValidator=()=>[
	param("id","Please provide Chat ID").notEmpty(),
	body("name","Please enter New name").notEmpty()
]

const SendRequestValidator=()=>[
	
	body("userId","Please enter User ID u djfakjdfakdjf;a").notEmpty()
]

const AcceptRequestValidator=()=>[
	body("requestId","Please enter Request ID").notEmpty(),
	body("accept").notEmpty()
	.withMessage("Please Add Accept")
	.isBoolean()
	.withMessage("Accept must be a boolean"),
]

const adminLoginValidator=()=>[
	body("secretKey","Please enter secret key ID").notEmpty(),
]




export {
	AcceptRequestValidator, addMembersValidator, adminLoginValidator, getChatIdValidator, loginValidator,
	newGroupChatValidator, registerValidator, removeMembersValidator, renameGroupValidator, sendAttachmentsValidator, SendRequestValidator, validateHandler
};
