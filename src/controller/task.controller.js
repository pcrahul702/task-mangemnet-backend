import { Task } from "../modals/task.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createTask = asyncHandler(async (req, res) => {
  const { title, description, dueDate, priority, status } = req.body;
  const userId = req.user?._id; // Assuming `req.user` is set by the JWT middleware

  if (!title || !dueDate) {
    throw new ApiError(400, "Title and Due Date are required.");
  }

  const task = await Task.create({
    title,
    description,
    dueDate,
    priority,
    status,
    userId,
  });

  if (!task) {
    throw new ApiError(500, "Failed to create task.");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Task created successfully.",task));
});
const getTasks = asyncHandler(async (req, res) => {
    const { sortBy = "dueDate", order = "asc" } = req.query; // Default sorting by due date in ascending order
    const userId = req.user._id; // Ensure tasks are filtered by the logged-in user
  
    // Validate sorting fields
    const validSortFields = ["dueDate", "priority"];
    if (!validSortFields.includes(sortBy)) {
      throw new ApiError(400, "Invalid sorting field.");
    }
  
    const sortOrder = order === "desc" ? -1 : 1; // Map `asc` to 1 and `desc` to -1
  
    // Fetch tasks sorted by the specified field and order
    const tasks = await Task.find({ userId })
      .sort({ [sortBy]: sortOrder })
      .select("-__v"); // Exclude version key if needed
  
    return res
      .status(200)
      .json(new ApiResponse(200, "Tasks fetched successfully.",tasks));
  });
  const getTaskDetails = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const userId = req.user._id; // Ensure the task belongs to the logged-in user
  
    // Validate the taskId
    if (!taskId) {
      throw new ApiError(400, "Task ID is required.");
    }
  
    // Find the task by ID and ensure it belongs to the current user
    const task = await Task.findOne({ _id: taskId, userId });
  
    if (!task) {
      throw new ApiError(404, "Task not found.");
    }
  
    return res
      .status(200)
      .json(new ApiResponse(200,"Task details fetched successfully.",task));
  });
  const editTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const userId = req.user._id; // Ensure the task belongs to the logged-in user
    const { title, description, dueDate, priority, status } = req.body;
  
    // Validate the taskId
    if (!taskId) {
      throw new ApiError(400, "Task ID is required.");
    }
  
    // Validate required fields (if applicable)
    if (!title || !dueDate) {
      throw new ApiError(400, "Title and due date are required.");
    }
  
    // Update the task
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, userId }, // Ensure the task belongs to the logged-in user
      { title, description, dueDate, priority, status },
      { new: true, runValidators: true } // Return the updated document and validate fields
    );
  
    if (!updatedTask) {
      throw new ApiError(404, "Task not found or unauthorized access.");
    }
  
    return res
      .status(200)
      .json(new ApiResponse(200, "Task updated successfully.", updatedTask));
  });
  const deleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const userId = req.user._id; // Ensure the task belongs to the logged-in user
  
    // Validate the taskId
    if (!taskId) {
      throw new ApiError(400, "Task ID is required.");
    }
  
    // Delete the task
    const task = await Task.findOneAndDelete({ _id: taskId, userId });
  
    if (!task) {
      throw new ApiError(404, "Task not found or unauthorized access.");
    }
  
    return res
      .status(200)
      .json(new ApiResponse(200,"Task deleted successfully.",null));
  });
  
  
export { createTask,getTasks,getTaskDetails,editTask,deleteTask };
