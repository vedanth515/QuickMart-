import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./configs/db.js";
import userRouter from "./routes/UserRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/OrderRoute.js";
import './configs/cloudinary.js';
import { stripeWebhooks } from "./controllers/orderController.js";

const app = express();
const port = process.env.PORT || 4000;

// Connect DB
await connectDB();

const allowedOrigins = [
  'http://localhost:5173',
  // 'https://quickmart-clw9.onrender.com',
  'https://quick-mart-psi.vercel.app'   // Vercel URL
];



// Middlewares
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());


// Stripe Webhook
app.post('/stripe', express.raw({ type: "application/json" }), stripeWebhooks);

// Routes
app.get('/', (req, res) => res.send("API is Working!"));
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;




