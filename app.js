const express = require("express");
const path = require("path");
const app = express();

const bodyParser = require("body-parser");
app.use(express.static("frontend"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Router
// const userRouter = require("./router/userRouter");

// app.use("/", userRouter);
app.get('/', (req, res) => {
    // Serve your HTML file
    res.sendFile(path.join(__dirname, "frontend", "views", "login.html"));
  });

app.listen(3000);