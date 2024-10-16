# **Files Manager**

## Description
The **Files Manager** is a backend project that provides a platform to upload, view, and manage files. It includes user authentication, background processing for image thumbnails, file permission management, and more. The system leverages **Node.js**, **Express**, **MongoDB**, **Redis**, and **Bull** for managing tasks like authentication, file uploads, and background processing.

---

## Table of Contents

- [Description](#description)
- [Technologies](#technologies)
- [Features](#features)
- [Requirements](#requirements)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Background Workers](#background-workers)
- [Testing](#testing)
- [License](#license)

---

## Technologies

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for Node.js.
- **MongoDB**: NoSQL database for storing users and files.
- **Redis**: In-memory data structure store for caching and session management.
- **Bull**: Job/task queue for background processing.
- **Mocha/Chai**: Testing framework and assertion library.

---

## Features

1. **User Authentication**: Token-based authentication using Redis.
2. **File Management**:
   - Upload files and images.
   - Retrieve files and metadata.
   - Generate thumbnails for images.
3. **Permission Management**: Ability to publish/unpublish files.
4. **Background Processing**: Use of Bull to handle tasks like generating image thumbnails and sending welcome emails.
5. **Pagination**: Support for pagination in file listings.
6. **API Testing**: Comprehensive tests for all functionalities.

---

## Requirements

To run this project, you will need the following installed:
- **Node.js** (v12.x or higher)
- **MongoDB** (v3.x or higher)
- **Redis** (v6.x or higher)
- **Bull** for task queuing
- **Mocha/Chai** for testing

---

## Project Structure

```plaintext
.
├── controllers
│   ├── AppController.js          # Handles status and statistics
│   ├── AuthController.js         # Handles user authentication
│   ├── FilesController.js        # Handles file uploads and retrieval
│   ├── UsersController.js        # Handles user registration and retrieval
│
├── routes
│   └── index.js                  # API route definitions
│
├── utils
│   ├── db.js                     # MongoDB connection
│   ├── redis.js                  # Redis client setup
│
├── worker.js                     # Bull worker handling background jobs
├── server.js                     # Express server setup
├── tests
│   ├── redis.test.js             # Redis client tests
│   ├── db.test.js                # MongoDB client tests
│   ├── app.test.js               # API tests for status and stats
│   ├── auth.test.js              # API tests for user authentication
│   └── files.test.js             # API tests for file uploads and management
├── package.json                  # Project dependencies and scripts
└── README.md                     # Project documentation
```

---

## Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Gideon-Phiri/alx-files_manager.git
   cd alx-files_manager
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the project root with the following variables:

   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=27017
   DB_DATABASE=files_manager
   REDIS_HOST=localhost
   REDIS_PORT=6379
   FOLDER_PATH=/tmp/files_manager
   ```

4. **Run MongoDB and Redis**:
   Ensure both MongoDB and Redis are running on your system.

5. **Start the server**:
   - To run the server in development mode:
     ```bash
     npm run dev
     ```
   - To start the worker for background tasks:
     ```bash
     npm run start-worker
     ```

---

## Usage

### **Running the Server**:
The server runs on the port specified in the `.env` file (`5000` by default). You can make requests to the various API endpoints for file uploads, user management, etc.

### **Running the Worker**:
Run the background worker to process image thumbnails and welcome emails:
```bash
npm run start-worker
```

---

## API Endpoints

### **Authentication**
- **POST /users** - Register a new user.
- **GET /connect** - Log in and retrieve an authentication token (Basic Auth required).
- **GET /disconnect** - Log out and invalidate the token.
- **GET /users/me** - Retrieve current authenticated user's details.

### **Files**
- **POST /files** - Upload a file or folder.
- **GET /files/:id** - Retrieve file metadata by ID.
- **GET /files** - List all files (supports pagination with `parentId` and `page` query parameters).
- **PUT /files/:id/publish** - Make a file public.
- **PUT /files/:id/unpublish** - Make a file private.
- **GET /files/:id/data** - Retrieve file content (supports image thumbnail sizes with the `size` query parameter).

### **App Status**
- **GET /status** - Check if Redis and MongoDB are alive.
- **GET /stats** - Retrieve statistics about users and files.

---

## Background Workers

### **Image Thumbnails**:
- A background job is triggered for uploaded images, generating thumbnails in 500px, 250px, and 100px sizes.
- Thumbnails are stored locally and can be retrieved via the `GET /files/:id/data?size=<size>` endpoint.

### **Welcome Emails**:
- When a new user is registered, a background job sends a "Welcome email" (simulated by logging to the console).
- In real production, this could integrate services like **Mailgun** or **SendGrid**.

---

## Testing

The project includes comprehensive tests for all functionality using **Mocha** and **Chai**.

### **Run Tests**:
To execute the tests, run:
```bash
npm test
```

### **Test Coverage**:
- **Redis Client Tests**: Verify Redis connectivity and key operations.
- **MongoDB Client Tests**: Verify MongoDB connectivity and document counting.
- **API Tests**: End-to-end tests for authentication, file uploads, and background processing.

---

## License

This project is licensed under the MIT License
