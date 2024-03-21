const User = require("../models/user_model");
const bcrypt = require("bcrypt");
const sequelize = require("../util/database");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const loggerObj = require("../util/logger");

const path = require("path");


const getHomePage = async (req, res, next) => {
  try {
    res.sendFile(
      path.join(__dirname, "../", "frontend", "views", "homePage.html")
    );
  } catch {
    (err) => console.log(err);
  }
};


function generateAccessToken(id, email, name) {
    return jwt.sign({ userId: id, email: email, name: name }, process.env.JWT_TOKEN);
  }

const getLoginPage = async (req, res, next) => {
    try {
      res.sendFile(path.join(__dirname, "../", 'frontend','views', 'login.html'));
    } catch (error) {
      console.log(error);
    }
  };

  const userSignUp = async (req, res, next) => {
    try {
      const name = req.body.name;
      const email = req.body.email;
      const number = req.body.number;
      const password = req.body.password;
  
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ email }, { number }],
        },
      });
  
      if (existingUser) {
        res
          .status(409)
          .send(
            `<script>alert('This email or number is already taken. Please choose another one.'); window.location.href='/'</script>`
          );
      } else {
        bcrypt.hash(password, 10, async (err, hash) => {
          await User.create({
            name: name,
            email: email,
            number: number,
            password: hash,
          });
        });
        res
          .status(200)
          .send(
            `<script>alert('User Created Successfully!'); window.location.href='/'</script>`
          );
      }
    } catch (error) {
      console.log(error);
    }
  };
  const userLogin = async (req, res, next) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
      loggerObj.info("user logged in")
      await User.findOne({ where: { email: email } }).then((user) => {
        if (user) {
          bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
              return res
                .status(500)
                .json({ success: false, message: "Something went Wrong!" });
            }
            if (result == true) {
              return res.status(200).json({
                success: true,
                message: "Login Successful!",
                token: generateAccessToken(user.id, user.email, user.name),
              });
            } else {
              return res.status(401).json({
                success: false,
                message: "Password Incorrect!",
              });
            }
          });
        } else {
          // return res.status(404).json({
          //   success: false,
          //   message: "User doesn't Exists!",
          // });
        
            return res.status(404).json({success : false , message : "please signup, you are not a memeber"})
      
        
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  module.exports = {
    getLoginPage,
    userSignUp,
    userLogin,
    getHomePage
   
  };
  