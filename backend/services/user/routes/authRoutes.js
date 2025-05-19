const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const authController = require("../controllers/authController");

router.post(
  "/sign-up",
  [
    body("name").notEmpty().withMessage("O nome é obrigatório."),
    body("email")
      .notEmpty()
      .withMessage("O e-mail é obrigatório.")
      .isEmail()
      .withMessage("O formato do e-mail é inválido."),
    body("password")
      .notEmpty()
      .withMessage("A senha é obrigatória.")
      .isLength({ min: 6 })
      .withMessage("A senha deve ter no mínimo 6 caracteres."),
    body("address").notEmpty().withMessage("O endereço é obrigatório."),
    body("phone").notEmpty().withMessage("O telefone é obrigatório."),
    body("cpf_cnpj")
      .notEmpty()
      .withMessage("O documento é obrigatório.")
      .isLength({ min: 11, max: 14 })
      .withMessage(
        "O documento deve ter no mínimo 11 e no máximo 14 caracteres."
      ),
    body("role")
      .notEmpty()
      .withMessage("O tipo de conta é obrigatório.")
      .custom((value) => {
        const validRoles = ["consumer", "producer"];

        if (!validRoles.includes(value)) {
          throw new Error("Tipo de conta inválido");
        }

        return true;
      }),
  ],
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    authController.signUp(req, res, next);
  }
);

router.post(
  "/sign-in",
  [
    body("email").notEmpty().withMessage("O e-mail é obrigatório."),
    body("password").notEmpty().withMessage("A senha é obrigatória."),
  ],
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    authController.signIn(req, res, next);
  }
);

module.exports = router;
