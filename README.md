# Internet Programming Project

This repository contains our Internet Programming course project. The current codebase includes a working Node.js/Express backend for authentication and a scaffolded React frontend folder structure. This README explains how to start the project and the proposed architecture going forward.

## Current Status

- Backend is implemented and runnable.
- MongoDB is required for the backend.
- Authentication endpoints are available: register, login, and get current user.
- Frontend folders have been created, but the frontend application is still a scaffold and is not yet fully bootstrapped in this repository.

## Tech Stack

- Frontend: React
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Authentication: JWT
- Password Hashing: bcryptjs

## Current Project Structure

```text
Internet-Programming/
├── backend/
│   ├── config/              # Database connection and backend configuration
│   ├── controllers/         # HTTP request handlers
│   ├── middleware/          # Authentication middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # API route definitions
│   ├── services/            # Business logic layer
│   ├── utils/               # Shared backend helpers
│   ├── .env.example         # Example environment variables
│   ├── app.js               # Express app setup
│   ├── server.js            # Backend server entry point
│   └── package.json         # Backend dependencies and scripts
├── frontend/
│   ├── public/              # Static frontend assets
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── context/         # React context providers
│       ├── hooks/           # Custom hooks
│       ├── pages/           # Page-level components
│       ├── routes/          # Frontend route definitions
│       ├── services/        # API communication layer
│       ├── utils/           # Frontend helper functions
│       ├── App.js           # Main React app component
│       └── index.js         # Frontend entry point
└── README.md
```

## Proposed Architecture

The project follows a layered modular architecture so that each feature remains organized and easy to extend.

### Backend Layering

- `routes/`: defines API endpoints.
- `controllers/`: handles request and response flow.
- `services/`: contains business logic and data processing.
- `models/`: defines MongoDB schemas.
- `middleware/`: handles cross-cutting concerns such as authentication.
- `utils/`: shared helpers such as JWT generation.

### Frontend Layering

- `pages/`: top-level screens.
- `components/`: reusable UI components.
- `routes/`: client-side navigation.
- `services/`: calls backend APIs.
- `context/`: shared application state such as authentication.
- `hooks/`: reusable frontend logic.
- `utils/`: formatting and helper logic.

Frontend flow:

```text
Page
	-> Component
	-> Service
	-> Backend API
```

### Proposed Target Folder Growth

The target structure for future modules is:

```text
backend/
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── postController.js
│   ├── commentController.js
│   ├── communityController.js
│   └── voteController.js
├── models/
│   ├── User.js
│   ├── Post.js
│   ├── Comment.js
│   ├── Community.js
│   └── Vote.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── posts.js
│   ├── comments.js
│   ├── communities.js
│   └── votes.js
└── services/
	 ├── authService.js
	 ├── userService.js
	 ├── postService.js
	 ├── commentService.js
	 ├── communityService.js
	 └── voteService.js
```


## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- MongoDB running locally or via MongoDB Atlas

## Backend Setup

1. Open a terminal in the backend folder.
2. Install dependencies.
3. Create the `.env` file.
4. Start MongoDB.
5. Run the backend server.

### Install Backend Dependencies

```bash
cd backend
npm install
```

### Environment Configuration

Create `backend/.env` using the example below:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/your_database_name
JWT_SECRET=uni_jwt_secret_key_2026_yourname_authentication_super_secure
JWT_EXPIRE=100d
NODE_ENV=development
```

### Run the Backend

Development mode with nodemon:

```bash
cd backend
npm run server
```

Production-style start:

```bash
cd backend
npm start
```

Once the backend is running, it will be available at:

```text
http://localhost:5000
```

## Frontend Setup

The frontend directory structure exists, but this repository currently does not include a frontend `package.json` or a completed React bootstrap. That means the backend can be run now, while the frontend still needs to be completed before the full client application can be started.

Planned frontend environment variable:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Available Backend API Endpoints

### Authentication

```text
POST /api/auth/register    # Register a new user
POST /api/auth/login       # Login user
GET  /api/auth/me          # Get currently authenticated user
```

## Current Backend Flow

### Authentication Flow

1. A client sends login or register data to `/api/auth/...`.
2. The route forwards the request to the controller.
3. The controller validates required input.
4. The service handles the main logic.
5. The model interacts with MongoDB.
6. A JWT token is returned on successful authentication.

### Backend Responsibilities by Folder

- `config/database.js`: connects the application to MongoDB.
- `controllers/authController.js`: handles register, login, and current-user requests.
- `services/authService.js`: contains authentication business logic.
- `middleware/auth.js`: protects private routes using JWT.
- `models/User.js`: stores user schema definition.
- `utils/generateToken.js`: creates JWT tokens.
