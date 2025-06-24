

// import express from "express"
// import { isSellerAuth, sellerLogin, sellerLogout } from "../controllers/sellerController.js";
// import authSeller from "../middlewares/authSeller.js";

// const sellerRouter = express.Router();

// sellerRouter.post('/login',sellerLogin);
// sellerRouter.get('/is-auth',authSeller,isSellerAuth);
// sellerRouter.get('/logout',sellerLogout);

// export default sellerRouter;




import express from "express";
import { sellerLogin, isSellerAuth, sellerLogout } from "../controllers/sellerController.js";
import authSeller from "../middlewares/authSeller.js";

const router = express.Router();

// Public route: Seller login
router.post('/login', sellerLogin);

// Protected route: Check if seller is logged in
router.get('/is-auth', authSeller, isSellerAuth);

// Seller logout
router.get('/logout', sellerLogout);

export default router;
