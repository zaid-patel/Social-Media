# Social-Media
This project is a backend API for a social media platform, built with Node.js, Express.js, and MongoDB. It supports user authentication (JWT), post creation, comments, real-time messaging (Socket.IO), and follow systems. Features include secure file uploads via Cloudinary, scalable architecture, and middleware for authentication and error handling.



Backend Server is Live
The backend server is live at the following link:
https://social-media-1-or9a.onrender.com

Note: Authentication is required to view any content. You can use tools like Postman for testing the endpoints.
Use the provided api documentation for better experience



To Run Locally
Fork the Repository:

Go to the GitHub repository and click on the Fork button.
Clone the Forked Repository:

Run the following command in your terminal:
git clone https://github.com/<your-username>/Social-Media.git


cd Social-Media


Set Up Environment Variables:

Create a .env file in the root directory.
Add the required environment variables (e.g., MONGODB_URI, JWT_SECRET, etc.).




.env:

PORT=8000

MONGODB_URI=mongodb+srv://zaid:mzip123@cluster0.vewc5dh.mongodb.net

CORS_ORIGIN=*

ACCESS_TOKEN_SECRET=nvnvkermlqwqkkodkidi4njcnke134jnjnnuu4i29

ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=1kwqkkw923idienm3i9e9kifrn49j49fj0w

REFRESH_TOKEN_EXPIRY=2d

CLOUDINARY_CLOUD_NAME= dzpdzuogb

CLOUDINARY_API_KEY= 212137711929392

CLOUDINARY_API_SECRET=otvKMh7jUP77a1wNYyBR-EX_6P8




Install Dependencies:

Run the following command to install all required dependencies:

npm install





Run the Server:

npm run dev

Access the Backend:

The backend will be running locally at:

http://localhost:8000
