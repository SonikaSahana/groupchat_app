const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

// const cors = require("cors");
// app.use(
//   cors({
//     origin: "*",
//   })
// );

const dotenv = require("dotenv");
dotenv.config();

const sequelize = require("./util/database");
const loggerObj = require("./util/logger");

app.use(express.static(path.join(__dirname, 'frontend')));;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Router
const userRouter = require("./router/userRouter");
const chatRouter = require("./router/chatRouter");
const groupRouter = require("./router/groupRouter");
const passwordRoutes = require('./router/forgot-password')

//Models
const User = require("./models/user_model");
const Chat = require("./models/chatModels");
const Group = require("./models/group_model");
const UserGroup = require("./models/admin_model");
const resetPassword = require('./models/resetPassword')

//Relationships between Tables
User.hasMany(Chat,  );

Chat.belongsTo(User);
Chat.belongsTo(Group);

User.hasMany(UserGroup);

Group.hasMany(Chat);
Group.hasMany(UserGroup);

UserGroup.belongsTo(User);
UserGroup.belongsTo(Group);

User.hasMany(resetPassword)
resetPassword.belongsTo(User)

//Middleware
app.use("/", userRouter);
app.use("/user", userRouter);

app.use("/homePage", userRouter);

app.use("/chat", chatRouter);

app.use("/group", groupRouter);

const job = require("./jobs/cron.js");
job.start();

sequelize
  .sync({ force: true })
  .then((result) => {
    loggerObj.log("started app server")
    app.listen(4000);
  })
  .catch((err) => console.log(err));
