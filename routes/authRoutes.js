const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getLoggedUser,
} = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/userinfo", auth, getLoggedUser);

module.exports = router;
