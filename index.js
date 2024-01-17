const express = require("express");
// port = 4001
const app = express();
require('dotenv').config()


const errorMiddleware = require("./middleware/error");


app.use(express.json());

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
