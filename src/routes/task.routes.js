import { Router } from "express";
import {
  getTasks,
  createTask,
  getTaskDetails,
  editTask,
  deleteTask,
} from "../controller/task.controller.js";
import { verfiyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/create").post(verfiyJWT, createTask);

router.route("/list").get(verfiyJWT, getTasks);

router.route("/:taskId").get(verfiyJWT, getTaskDetails);

router.route("/:taskId").put(verfiyJWT, editTask);

router.route("/:taskId").delete(verfiyJWT, deleteTask);

export default router;
