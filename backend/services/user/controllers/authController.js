const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Consumer = require("../models/Consumer");
const Producer = require("../models/Producer");

exports.signUp = async (req, res, next) => {
  try {
    const { name, email, password, phone, address, role, cpf_cnpj } = req.body;
    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
      cpf_cnpj,
      active: true,
    });

    if (role === "consumer") {
      await Consumer.create({ id: user.id });
    } else {
      await Producer.create({
        id: user.id,
        cpf_cnpj: req.body.cpf_cnpj,
      });
    }

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role,
    });
  } catch (error) {
    error.clientMessage = "Falha no cadastro do usuário";
    error.statusCode = error.statusCode || 500;
    error.type = error.type || "user_creation_error";

    next(error);
  }
};

exports.signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    const validPassword = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!user || !validPassword) {
      const error = new Error("Credenciais inválidas");
      error.statusCode = 401;
      error.type = "auth_failed";
      error.clientMessage = "Combinação email/senha incorreta";

      return next(error);
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    error.clientMessage = "Falha no processo de login";
    error.statusCode = error.statusCode || 500;
    error.type = error.type || "auth_error";
    next(error);
  }
};
