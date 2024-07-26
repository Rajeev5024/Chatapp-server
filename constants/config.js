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

const CHATAPP_TOKEN="Chatapp-token";

export {corsOptions, CHATAPP_TOKEN}
