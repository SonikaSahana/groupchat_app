const express = require("express");
const path = require("path");
const app = express();

const bodyParser = require("body-parser");
app.use(express.static("frontend"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const dotenv = require("dotenv");
dotenv.config();

const sequelize = require("./util/database");

//Router
const userRouter = require("./router/userRouter");

const User = require("./models/user");

 app.use("/", userRouter);
 app.use("/user/signup",userRouter)
// app.get('/', (req, res) => {
//     // Serve your HTML file
//     res.sendFile(path.join(__dirname, "frontend", "views", "login.html"));
//   });

sequelize.sync({ force: true })
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));