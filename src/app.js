import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // set arigin where we want to access the backend.
    credentials: true,
  })
);
app.use(
  express.json({
    limit: "16kb", // alow the data which size is 16kb
  })
);
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //handle the data which comming throgh  headers and manage whitepsace.
app.use(express.static("public")); // static is handle files pdf and store it on sever, i have pass the folder name where we keep the file.
app.use(cookieParser()); //to aceess the browser cookoe of user and perform read and write opration from server  , set secure cookee in user browser.

// routes import
import userRouter from "./routes/user.route.js"
import taskRoutes from "./routes/task.routes.js";

// Route declaration
app.use("/api/v1/users", userRouter); // Fixed double slashes
app.use("/api/v1/task",taskRoutes)

// Health check route
app.get('/health', (req, res) => { 
  return res.status(200).json({
    message: 'Working',
  });
});




export { app };
