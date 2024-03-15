const express = require("express");
const UserController = require("../controllers/UserController");
const ChatController = require("../controllers/ChatController");
const MessageController = require("../controllers/MessageController");
const BusinessController = require("../controllers/BusinessController");
const ProductServiceController = require("../controllers/ProductServiceController");
const PostController = require("../controllers/PostController");
const router = express.Router();

// ------------------------- User Routes -----------------------------------------------------------------------

router.post("/get-allUser-byQuery", UserController.getAllUsersByQuery);
router.post("/getAllCustomer", UserController.getAllCustomers);
router.post("/getAllBusinessUser", UserController.getAllBusinessUser);
router.get("/userDetails/via-token", UserController.getUserByToken);
router.put("/update", UserController.updateUser);
router.put(
  "/update-password/via-oldPassword",
  UserController.updateSelfPassword
);
router.delete("/delete/:id", UserController.deleteUser);

// --------------------------- Business Routes -----------------------------------------------------------------

router.post("/business/create", BusinessController.createBusiness);
router.post("/business/all", BusinessController.getAllBusinesses);
router.get("/business/fetch-via-token", BusinessController.getBusinessByToken);
router.put("/business/update", BusinessController.updateBusiness);
router.delete(
  "/business/delete/:businessId",
  BusinessController.deleteBusiness
);

// ----------------------------- Product-Service Routes --------------------------------------------------------

router.post(
  "/product-service/add",
  ProductServiceController.addProductOrService
);

router.post(
  "/product-service/all",
  ProductServiceController.getAllProductService
);

router.post(
  "/product-service-businessId/all",
  ProductServiceController.getProductServiceByBusinessId
);

router.put(
  "/product-service/update",
  ProductServiceController.updateProductOrService
);

router.delete(
  "/delete-product-service/:proSerId",
  BusinessController.deleteBusiness
);

// ----------------------------- Post Routes --------------------------------------------------------

router.post("/post/create", PostController.createPost);
router.post("/post/all", PostController.getAllPost);
router.post("/post-businessId/all", PostController.getPostByBusinessId);
router.put("/post/update", PostController.updatePost);
router.delete("/post/:postId", PostController.deletePost);

// ------------------------- Chat Routes -----------------------------------------------------------------------

router.post("/chat", ChatController.accessChat);
router.get("/chat", ChatController.fetchChats);

// ------------------------- Message Routes --------------------------------------------------------------------

router.post("/message", MessageController.sendMessage);
router.get("/message/:chatId", MessageController.allMessages);

module.exports = router;
