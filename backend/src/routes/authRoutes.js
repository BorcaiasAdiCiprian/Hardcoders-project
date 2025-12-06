//Rute de autentificare

const express = require("express");
const router = express.Router();
const { userController } = require("../controllers");
const checkAuth = require("../middlewares/auth");

router.post("/login", userController.loginUser);
router.post("/register", userController.createUser);
router.get("/me", checkAuth, userController.getCurrentUser);

module.exports = router;