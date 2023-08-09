const express = require("express");
const app = express();
const port = 4001;
const errorMiddleware = require("./middleware/error")


app.use(express.json())



// Database confi
require("./config/dbConfig");

// Handling uncaught exception

process.on("uncaughtException", (err)=>{
  console.log(`Error: ${err.message}`)
  console.log(`Shutting down the server due to uncaught exception`)
  process.exit(1)
})

// router export
const router = require("./routes/index");

app.use("/api", router);


// middleware for error
app.use(errorMiddleware)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

//  Unhandled Promise Rejection

process.on("unhandledRejection", (err)=>{
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(()=>{
      process.exit(1)
  })
})
