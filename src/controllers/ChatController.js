const User = require("../models/User");
const Message = require("../models/Message");
const Chat = require("../models/Chat");
const { Op } = require("sequelize");
const moment = require("moment");

const accessChat = async (req, res) => {
  try {
    const { personId } = req.body;

    if (!personId) {
      return res.status(200).send({
        status: 400,
        message: "personId not sent with request body!",
      });
    }

    const isChat = await Chat.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { "$chatsender.id$": req.person.id },
              { "$receive.id$": req.person.id },
            ],
          },
          {
            [Op.or]: [
              { "$chatsender.id$": personId },
              { "$receive.id$": personId },
            ],
          },
        ],
      },
      include: [
        {
          model: User,
          as: "chatsender",
          attributes: ["id", "name", "email", "photo", "userType"],
        },
        {
          model: User,
          as: "receive",
          attributes: ["id", "name", "email", "photo", "userType"],
        },
        {
          model: Message,
          as: "msg",
        },
      ],
    });

    if (isChat.length > 0) {
      const chatSenId = isChat[0].chatSenderId;
      const chatSenObjId = isChat[0].chatsender.id;

      if (req.person.id !== chatSenId) {
        isChat[0].chatSenderId = req.person.id;
        isChat[0].personId = personId;
      }

      if (req.person.id !== chatSenObjId) {
        [isChat[0].chatsender, isChat[0].receive] = [
          isChat[0].receive,
          isChat[0].chatsender,
        ];
      }
      await isChat[0].save();

      return res.status(201).json({ status: 200, isChat: isChat[0] });
    } else {
      const chatData = {
        chatSenderId: req.person.id,
        personId: personId,
        createdAt: moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
      };

      const createdChat = await Chat.create(chatData);

      const fullChat = await Chat.findOne({
        where: { id: createdChat.id },
        include: [
          {
            model: User,
            as: "chatsender",
            attributes: ["id", "name", "email", "photo", "userType"],
          },
          {
            model: User,
            as: "receive",
            attributes: ["id", "name", "email", "photo", "userType"],
          },
          {
            model: Message,
            as: "msg",
          },
        ],
      });

      const chatSenId = fullChat.chatSenderId;
      const chatSenObjId = fullChat.chatsender.id;

      if (req.person.id !== chatSenId) {
        [fullChat.chatSenderId, fullChat.personId] = [
          fullChat.personId,
          fullChat.chatSenderId,
        ];
      }

      if (req.person.id !== chatSenObjId) {
        [fullChat.chatsender, fullChat.receive] = [
          fullChat.receive,
          fullChat.chatsender,
        ];
      }
      await fullChat.save();

      return res
        .status(200)
        .json({ status: 200, fullChat, msg: "Suceessfully Fetch Chats!" });
    }
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      status: 500,
      message: "Internal Server Error",
      data: err,
    });
  }
};

const fetchChats = async (req, res) => {
  try {
    const results = await Chat.findAll({
      where: {
        [Op.or]: [
          { "$chatsender.id$": req.person.id },
          { "$receive.id$": req.person.id },
        ],
      },
      include: [
        {
          model: User,
          as: "chatsender",
          attributes: {
            exclude: ["password", "fpToken", "createdAt", "updatedAt"],
          },
        },

        {
          model: User,
          as: "receive",
          attributes: {
            exclude: ["password", "fpToken", "createdAt", "updatedAt"],
          },
        },

        {
          model: Message,
          as: "msg",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (results.length > 0) {
      const loggedUserId = req.person.id;
      for (let i = 0; i < results.length; i++) {
        const chatSenId = results[i].chatSenderId;
        const chatSenObjId = results[i].chatsender.id;

        if (loggedUserId !== chatSenId) {
          [results[i].chatSenderId, results[i].personId] = [
            results[i].personId,
            results[i].chatSenderId,
          ];
        }

        if (loggedUserId !== chatSenObjId) {
          [results[i].chatsender, results[i].receive] = [
            results[i].receive,
            results[i].chatsender,
          ];
        }

        await results[i].save();
      }
    }
    return res.status(200).send({ status: 200, result: results });
  } catch (error) {
    console.error(error);
    res.status(200).json({ status: 500, msg: error.message });
  }
};

module.exports = { accessChat, fetchChats };
