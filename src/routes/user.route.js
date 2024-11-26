import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controller/user.controller.js";
import { verfiyJWT } from "../middleware/auth.middleware.js";
const router=Router();
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verfiyJWT,logoutUser)
export  default router;