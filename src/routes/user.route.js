import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  getAllUsers,
  getUserById
} from "../controller/user.controller.js";
import { verfiyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();
// router.route("/register").post(registerUser);
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verfiyJWT, logoutUser);
router.route("/").get(verfiyJWT, getAllUsers);
router.route("/:userId").get(verfiyJWT,getUserById);
export default router;
