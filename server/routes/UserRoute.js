
// // import express from "express";
// import { Router } from "express";
// import { isAuth, login, logout, register } from "../controllers/UserController.js";
// import authUser from "../middlewares/authUser.js";

// // const userRouter = express.Router();
// const userRouter = Router();

// userRouter.post('/register', register);
// userRouter.post('/login', login);
// userRouter.get('/is-auth', authUser, isAuth);
// userRouter.get('/logout', authUser, logout);

// export default userRouter;



import express from "express";
import { register, login, isAuth, logout } from "../controllers/UserController.js";
import authUser from "../middlewares/authUser.js";

const router = express.Router();

// Public Routes
router.post('/register', register);
router.post('/login', login);

// Protected Route — only if user is logged in (token required)
router.get('/is-auth', authUser, isAuth);

// Logout
router.get('/logout', logout);

export default router;
