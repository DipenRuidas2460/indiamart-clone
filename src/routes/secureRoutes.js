const express = require("express");
const UserController = require("../controllers/UserController");
const ChatController = require("../controllers/ChatController");
const MessageController = require("../controllers/MessageController");
const BusinessController = require("../controllers/BusinessController");
const router = express.Router();

// ------------------------- User Routes -----------------------------------------------------------------------

router.post("/get-allUser-byQuery", UserController.getAllUsersByQuery);
router.put("/update", UserController.updateUser);
router.get("/userDetails/via-token", UserController.getUserByToken);
router.put(
  "/update-password/via-oldPassword",
  UserController.updateSelfPassword
);
router.delete("/delete", UserController.deleteUser);

// --------------------------- Business Routes -----------------------------------------------------------------

router.post("/business/create", BusinessController.createBusiness);

// ------------------------- Chat Routes -----------------------------------------------------------------------

router.post("/chat", ChatController.accessChat);
router.get("/chat", ChatController.fetchChats);

// ------------------------- Message Routes --------------------------------------------------------------------

router.post("/message", MessageController.sendMessage);
router.get("/message/:chatId", MessageController.allMessages);

module.exports = router;
