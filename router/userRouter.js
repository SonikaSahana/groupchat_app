const express = require("express");
const router = express.Router();

const userController = require("../controller/userController");

router.get("/", userController.getLoginPage);
router.post("/signup", userController.userSignUp);
router.post("/login", userController.userLogin);

module.exports = router;