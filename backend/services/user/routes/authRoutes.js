const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { body } = require("express-validator");

router.post(
  "/signup",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
  ],
  authController.signup
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  authController.login
);

router.post("/logout", authController.logout);

module.exports = router;
