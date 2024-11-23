Social-Media Backend
This project is a backend API for a social media platform, built with Node.js, Express.js, and MongoDB. It includes features such as:

User Authentication: JWT-based authentication for secure login and token management.
Post Creation and Comments: APIs for creating, retrieving, and managing posts and their comments.
Real-Time Messaging: Powered by Socket.IO for instant communication between users.
Follow System: Allows users to follow/unfollow other users.
Secure File Uploads: Integrated with Cloudinary for uploading images and other media files.
Middleware: For authentication, error handling, and scalable architecture.
Backend Server is Live
The backend server is live and accessible at the following link:

https://social-media-1-or9a.onrender.com

Note:
Authentication is required to access any content. Use tools like Postman to test the endpoints.
For a smoother experience, refer to the provided API Documentation.

To Run Locally
1. Fork the Repository
Go to the GitHub repository and click on the Fork button.
2. Clone the Forked Repository
Open your terminal and run:
bash
Copy code
git clone https://github.com/<your-username>/Social-Media.git
cd Social-Media
3. Set Up Environment Variables
Create a .env file in the root directory.

Add the following required environment variables:

env
Copy code
PORT=8000

MONGODB_URI=mongodb+srv://zaid:mzip123@cluster0.vewc5dh.mongodb.net

CORS_ORIGIN=*

ACCESS_TOKEN_SECRET=nvnvkermlqwqkkodkidi4njcnke134jnjnnuu4i29

ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=1kwqkkw923idienm3i9e9kifrn49j49fj0w

REFRESH_TOKEN_EXPIRY=2d

CLOUDINARY_CLOUD_NAME=dzpdzuogb

CLOUDINARY_API_KEY=212137711929392

CLOUDINARY_API_SECRET=otvKMh7jUP77a1wNYyBR-EX_6P8
If you're unsure about the .env file, contact mohmedzaid.patel22@spit.ac.in to get the required variables.

4. Install Dependencies
Install all necessary dependencies using:
bash
Copy code
npm install
5. Run the Server
Start the development server with:
bash
Copy code
npm run dev
6. Access the Backend
The backend will be running locally at:
arduino
Copy code
http://localhost:8000
Features
Authentication: JWT-based secure login and token refresh system.
Post Management: Create, retrieve, update, and delete posts.
Comment System: Add and delete comments on posts.
Real-Time Chat: Built using Socket.IO for seamless communication.
File Uploads: Supports media uploads via Cloudinary.
Follow System: Manage followers and following relationships.
Tech Stack
Backend: Node.js, Express.js
Database: MongoDB (with Mongoose)
Real-Time: Socket.IO
File Storage: Cloudinary
Authentication: JWT (Access & Refresh Tokens)
Environment Management: dotenv
