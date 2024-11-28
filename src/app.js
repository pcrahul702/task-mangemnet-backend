import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// CORS Configuration
const corsOptions = {
  origin: "https://fronted-assignment.vercel.app", // Replace with your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true, // Allow cookies to be sent
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes import
import userRouter from "./routes/user.route.js";
import taskRoutes from "./routes/task.routes.js";

// Route declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/task", taskRoutes);

// Health check route
app.get("/health", (req, res) => {
  return res.status(200).json({
    message: "Working",
  });
});

export { app };
