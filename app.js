const express = require("express");
const app = express();

const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

require("dotenv").config();
const { APP_PORT } = process.env;

const bodyParser = require("body-parser");
const cors = require("cors");
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(cors());
app.use("/public", express.static("public"));
app.use(morgan("dev"));

const authorRouter = require("./src/routes/author");
const bookRouter = require("./src/routes/book");
const genreRouter = require("./src/routes/genre");
const transactionMemberRouter = require("./src/routes/transaction_member");
const transactionRouter = require("./src/routes/transaction");
const authRouter = require("./src/routes/auth");
const userRouter = require("./src/routes/user");

app.use("/author", authorRouter);
app.use("/books", bookRouter);
app.use("/genre", genreRouter);
app.use("/transaction", transactionRouter);
app.use("/member/transaction", transactionMemberRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);

app.listen(APP_PORT, (err) => {
  if (err) throw err;
  console.log("Server has been started @port", APP_PORT);
});
