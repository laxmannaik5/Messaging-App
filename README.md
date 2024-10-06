# Real-Time Chat Application

This is a real-time chat application built with React for the frontend and Node.js with Express for the backend. It uses Socket.IO for real-time communication and MongoDB for data storage.

## Features

- User registration and login
- Real-time messaging
- User search functionality
- Message history

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or later)
- MongoDB (v4 or later)
- npm (usually comes with Node.js)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/laxmannaik5/messaging-app.git
   cd https://github.com/laxmannaik5/messaging-app.git
   ```

2. Install dependencies for the server:
   ```
   cd server
   npm install
   ```

3. Install dependencies for the client:
   ```
   cd ../client
   npm install
   ```

## Configuration

1. Create a `.env` file in the `server` directory with the following content:
   ```
   MONGODB_URI=mongodb://localhost:27017/chat-app
   ```
   Replace `your_jwt_secret_here` with a secure random string.

2. Ensure MongoDB is running on your local machine or update the `MONGODB_URI` if using a remote database.

## Running the Application

1. Start the server:
   ```
   cd server
   node index.js
   ```
   The server will run on `http://localhost:5000`.

2. In a new terminal, start the client:
   ```
   cd client
   npm start
   ```
   The client will run on `http://localhost:3000`.

3. Open your browser and navigate to `http://localhost:3000` to use the application.

## Usage

1. Register a new account or log in with existing credentials.
2. Once logged in, you'll see a list of users on the left sidebar.
3. Click on a user to start a conversation.
4. Type your message in the input field at the bottom and press Enter or click Send to send a message.
5. Messages will appear in real-time for both sender and recipient.

If you have any questions or feedback, please contact [Laxman Naik](mailto:laxmannaik5055@gmail.com).
