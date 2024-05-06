const express = require("express");
const app = express();
require('dotenv').config()
const cors = require('cors')


const errorMiddleware = require("./middleware/error");


app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
  methods: ['GET', 'POST',"DELETE", "PUT" ,"OPTIONS"], // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'], // Allow these headers
  credentials: true // Allow sending cookies from the client
}));

app.use(express.json());

app.use(express.static(__dirname + 'public'));

app.use('/uploads', express.static('uploads'));

// Database config 
require("./config/dbConfig");

// Handling uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to uncaught exception`);
  process.exit(1);
});

// Router export
const router = require("./routes/index");

app.use("/api", router);



// Middleware for error
app.use(errorMiddleware);

const server = app.listen(process.env.PORT || 4001, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});




