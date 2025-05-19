const User = require("../services/user/models/User");
const Producer = require("../services/user/models/Producer");

module.exports = async (req, res, next) => {
  try {
    const producer = await Producer.findOne({
      where: { id: req.user.id },
      include: [
        {
          model: User,
          where: { active: true },
          attributes: [],
        },
      ],
    });

    if (!producer) {
      return res.status(403).json({
        error: "Acesso restrito a produtores ativos",
        solution: "Complete seu cadastro como produtor ou ative sua conta",
      });
    }

    req.producer = producer;
    next();
  } catch (error) {
    console.error("Erro no middleware de produtor:", error);
    res.status(500).json({ error: "Erro ao verificar permissões" });
  }
};
