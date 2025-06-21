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

// Connect DB..
await connectDB();

// ✅ GOOD CORS CONFIG — only this one
const allowedOrigins = [
  'http://localhost:5173',
  'https://quick-mart-psi.vercel.app'   // your Vercel frontend URL
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Stripe Webhook
app.post('/stripe', express.raw({ type: "application/json" }), stripeWebhooks);

// Middlewares
app.use(express.json());
app.use(cookieParser());

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
