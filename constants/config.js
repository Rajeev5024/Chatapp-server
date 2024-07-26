// [
// 	// 	"http://127.0.0.1:5173",
// 	// 	"http://localhost:4173",
// 	// 	process.env.CLIENT_URL,
	
// 	 ],
const corsOptions={
	
		origin:"*",
		credentials:true,
	
}

const CHATAPP_TOKEN="Chatapp-token";

export {corsOptions, CHATAPP_TOKEN}