const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { body } = require("express-validator");

router.post(
  "/signup",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  authController.signup
);

router.post(
  "/signin",
  [body("email").isEmail(), body("password").notEmpty()],
  authController.signin
);

router.post("/singout", authController.signout);

module.exports = router;
