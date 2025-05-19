require("dotenv").config();
const app = require("./config/app");
const sequelize = require("./config/database");

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Conectado ao banco de dados com sucesso");

    await sequelize.sync({ alter: true });
    console.log("Tabelas sincronizadas");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar o servidor:", error);
    process.exit(1);
  }
}

startServer();
