const express = require('express');
const app = express();
const PORT = 3000;

// Importa as rotas auth
const authRoutes = require('./services/auth/routes/authRoutes');

app.use(express.json());

// Usa as rotas /auth (ex: /auth/ping)
app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});