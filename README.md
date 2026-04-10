# Internet Programming Project

This repository contains our Internet Programming course project. The current codebase includes a working Node.js/Express backend for authentication and a bootstrapped React frontend scaffold. This README explains how to run both applications together and how the project is organized.

## Current Status

- Backend is implemented and runnable.
- MongoDB is required for the backend.
- Authentication endpoints are available: register, login, and get current user.
- Frontend structure and dependencies are initialized.
- Root scripts are available to run frontend and backend together.

## Tech Stack

- Frontend: React
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Authentication: JWT
- Password Hashing: bcryptjs

## Current Project Structure

```text
Internet-Programming/
├── package.json             # Root scripts for running both apps together
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
│   │   ├── index.html
│   │   └── manifest.json
│   ├── package.json         # Frontend dependencies and scripts
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── context/         # React context providers
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

## Quick Start (Recommended)

Use these commands from the project root to run both frontend and backend.

```bash
npm install
npm run install-all
npm run dev
```

This starts:

- Backend (nodemon) from `backend/`
- Frontend React development server from `frontend/`

## Root Scripts

- `npm run dev`: starts both apps at once.
- `npm run server`: runs backend in development mode (nodemon).
- `npm run client`: runs the frontend React dev server.
- `npm run install-all`: installs backend and frontend packages.
- `npm run build`: builds the frontend production bundle.

Additional helper scripts:

- `npm run install-server`: installs backend dependencies only.
- `npm run install-client`: installs frontend dependencies only.

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
npm run dev
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

The frontend is initialized with React scripts and routing dependencies.

Run frontend only:

```bash
cd frontend
npm install
npm start
```

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
