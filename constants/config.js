<<<<<<< HEAD
// origin:[
// 	"http://127.0.0.1:5173",
// 	"http://localhost:4173",
// 	process.env.CLIENT_URL,
// ],


const corsOptions={
		origin : "*",
		credentials:true,
}
=======
// [
// 	// 	"http://127.0.0.1:5173",
// 	// 	"http://localhost:4173",
// 	// 	process.env.CLIENT_URL,
	
// 	 ],
const corsOptions = {
  origin: true, // This will allow requests from any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // if you need to send cookies
};
>>>>>>> be72c45fc71b846d766dcad0648671c8fe2a9794

const CHATAPP_TOKEN="Chatapp-token";

export {corsOptions, CHATAPP_TOKEN}
