const path = require("path");
const User = require("../models/user_model");
const Group = require("../models/group_model");
const UserGroup = require("../models/admin_model");
const { Op } = require("sequelize");

exports.createGroup = async (req, res, next) => {
  try {
    const groupName = req.body.groupName;
    const admin = req.user.name;
    const members = req.body.members;

    const group = await Group.create({ name: groupName, admin: admin });

    const invitedMembers = await User.findAll({
      where: {
        email: {
          [Op.or]: members,
        },
      },
    });

    (async () => {
      await Promise.all(
        invitedMembers.map(async (user) => {
          const response = await UserGroup.create({
            isadmin: false,
            userId: user.dataValues.id,
            groupId: group.dataValues.id,
          });
        })
      );

      await UserGroup.create({
        isadmin: true,
        userId: req.user.id,
        groupId: group.dataValues.id,
      });
    })();

    res.status(201).json({ group: group.dataValues.name, members: members });
  } catch (error) {
    console.log(error);
  }
};

exports.addToGroup = async (req, res, next) => {
  try {
    const groupName = req.body.groupName;
    const members = req.body.members;

    const group = await Group.findOne({ where: { name: groupName } });
    if (group) {
      const admin = await UserGroup.findOne({
        where: {
          [Op.and]: [{ isadmin: 1 }, { groupId: group.id }],
        },
      });
      if (admin.userId == req.user.id) {
        const invitedMembers = await User.findAll({
          where: {
            email: {
              [Op.or]: members,
            },
          },
        });

        await Promise.all(
          invitedMembers.map(async (user) => {
            const response = await UserGroup.create({
              isadmin: false,
              userId: user.dataValues.id,
              groupId: group.dataValues.id,
            });
          })
        );
        res.status(201).json({ message: "members added successfully!" });
      } else {
        res.status(201).json({ message: "only admins aan add new members" });
      }
    } else {
      res.status(201).json({ message: "group doesn't exists!" });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getGroups = async (req, res, next) => {
  try {
    const groups = await Group.findAll({
      attributes: ["name", "admin"],
      include: [
        {
          model: UserGroup,
          where: { userId: req.user.id },
        },
      ],
    });
    res.status(200).json({ groups: groups });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteFromGroup = async (req, res, next) => {
  try {
    const groupName = req.body.groupName;
    const members = req.body.members;

    const group = await Group.findOne({ where: { name: groupName } });
    if (group) {
      const admin = await UserGroup.findOne({
        where: {
          [Op.and]: [{ isadmin: 1 }, { groupId: group.id }],
        },
      });
      if (admin.userId == req.user.id) {
        const invitedMembers = await User.findAll({
          where: {
            email: {
              [Op.or]: members,
            },
          },
        });

        await Promise.all(
          invitedMembers.map(async (user) => {
            const response = await UserGroup.destroy({
              where: {
                [Op.and]: [
                  {
                    isadmin: false,
                    userId: user.dataValues.id,
                    groupId: group.dataValues.id,
                  },
                ],
              },
            });
          })
        );
        res.status(201).json({ message: "members deleted successfully!" });
      } else {
        res.status(201).json({ message: "only admins can delete members" });
      }
    } else {
      res.status(201).json({ message: "group doesn't exists!" });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.groupMembers = async (req, res, next) => {
  try {
    const groupName = req.params.groupName;
    const group = await Group.findOne({ where: { name: groupName } });
    const userGroup = await UserGroup.findAll({
      where: { groupId: group.dataValues.id },
    });

    const users = [];

    await Promise.all(
      userGroup.map(async (user) => {
        const res = await User.findOne({
          where: { id: user.dataValues.userId },
        });
        users.push(res);
      })
    );
    res.status(200).json({ users: users });
  } catch (error) {
    console.log(error);
  }
};
