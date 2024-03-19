const path = require("path");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const getMessages = async (groupName) => {
  try {
    const group = await Group.findOne({ where: { name: groupName } });
    const messages = await Chat.findAll({ where: { groupId: group.dataValues.id } });
    console.log("Request Made");
    return messages;
  } catch (error) {
    console.log(error);
    return [];
  }
};

// Define the sendMessage controller function
exports.sendMessage = async (req, res, next) => {
  try {
    const group = await Group.findOne({ where: { name: req.body.groupName } });

    await Chat.create({
      name: req.user.name,
      message: req.body.message,
      userId: req.user.id,
      groupId: group.dataValues.id,
    });
    return res.status(200).json({ message: "Success!" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error" });
  }
};

module.exports = {
    getMessages,
    sendMessage

  };
  