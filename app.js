const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(express.static("frontend"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Router
const userRouter = require("./router/userRouter");

app.use("/", userRouter);

app.listen(3000);