const express = require("express");
const router = express.Router();

const { getProfileImage, getFiles } = require("../helpers/fileHelper");
const AuthController = require("../controllers/AuthController");

// ---------------------------- Auth Routes -------------------------------------------------------------------

router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser);
router.post("/forgotpass", AuthController.forgetPass);
router.post("/resetpass", AuthController.fpUpdatePass);

// ----------------- Access Profile Photo && files ----------------------------------------------------------------------

router.get("/assets/image/:fileName", getProfileImage);
router.get("/assets/files/:fileName", getFiles);

module.exports = router;
