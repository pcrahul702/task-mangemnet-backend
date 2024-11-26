Backend Project
This project is a backend application built using Node.js and Express. It serves as a RESTful API for managing users and tasks, implementing user authentication (JWT) and supporting task management features such as creating, editing, viewing, and deleting tasks.

Features
User Authentication: Handles user login and registration with JWT-based authentication.
Task Management: Allows users to create, update, view, and delete tasks.
JWT Token: Used for user authentication and to protect secured routes.
Sorting: Tasks can be sorted by due date and priority.
Pagination: Uses mongoose-aggregate-paginate-v2 for pagination support on tasks.
Tech Stack
Node.js: JavaScript runtime for building server-side applications.
Express.js: Web framework for building RESTful APIs.
MongoDB: NoSQL database used for storing user and task data.
Mongoose: ODM (Object Data Modeling) library for MongoDB in Node.js.
JWT (JSON Web Token): For user authentication and protecting routes.
bcrypt: For hashing and comparing passwords securely.
dotenv: For managing environment variables.
cors: Middleware for enabling Cross-Origin Resource Sharing (CORS).
cookie-parser: Middleware for parsing cookies.
nodemon: Development tool for automatically restarting the server on code changes.
prettier: Code formatter for maintaining consistent code style.

git clone <repository-url>

cd backend

npm install

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
CORS_ORIGIN=http://your-frontend-url.com

for run this project use command - npm run dev
Runs the application in development mode using nodemon, which automatically restarts the server when changes are made. The dotenv/config is used to load environment variables, and the --experimental-json-modules flag allows the use of JSON modules.

API Endpoints

User Authentication
POST /api/v1/users/register: Registers a new user.
POST /api/v1/users/login: Logs in a user and generates access and refresh tokens.
POST /api/v1/users/logout: Logs out the user and clears cookies.

Task Management

GET /api/v1/task: Fetches a list of tasks for the logged-in user, with optional sorting by dueDate or priority and ordering (asc or desc).

POST /api/v1/task: Creates a new task.

GET /api/v1/task/:id: Fetches a specific task by ID.

PUT /api/v1/task/:id: Updates an existing task.

DELETE /api/v1/task/:id: Deletes a task.

Environment Variables

refrence - env.example

Dependencies

bcrypt: ^5.1.1
cookie-parser: ^1.4.7
cors: ^2.8.5
dotenv: ^16.4.5
express: ^4.21.1
jsonwebtoken: ^9.0.2
mongoose: ^8.7.3
mongoose-aggregate-paginate-v2: ^1.1.2
Development Dependencies
nodemon: ^3.1.7
prettier: ^3.3.3
