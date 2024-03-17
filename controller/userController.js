const path = require("path");
const getLoginPage = async (req, res, next) => {
    try {
      res.sendFile(path.join(__dirname, "../", "frontend", "views", "login.html"));
    } catch (error) {
      console.log(error);
    }
  };

  module.exports = {
    getLoginPage,
  };
  