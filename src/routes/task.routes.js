import { Router } from "express";
import { getTasks, createTask, getTaskDetails, editTask, deleteTask } from "../controller/task.controller.js";
import { verfiyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Secure route for task creation
router.route("/create").post(verfiyJWT, createTask);

// Secure route for fetching tasks
router.route("/list").get(verfiyJWT, getTasks);

// Secure route for fetching task details
router.route("/:taskId").get(verfiyJWT, getTaskDetails);

// Secure route for editing a task
router.route("/:taskId").put(verfiyJWT, editTask);

// Secure route for deleting a task
router.route("/:taskId").delete(verfiyJWT, deleteTask);

export default router;
