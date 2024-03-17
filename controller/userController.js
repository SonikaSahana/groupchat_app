const User = require("../models/user");
const bcrypt = require("bcrypt");
const sequelize = require("../util/database");
const { Op } = require("sequelize");

const path = require("path");
const getLoginPage = async (req, res, next) => {
    try {
      res.sendFile(path.join(__dirname, "../", 'frontend','views', 'signup.html'));
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

  module.exports = {
    getLoginPage,
    userSignUp
  };
  