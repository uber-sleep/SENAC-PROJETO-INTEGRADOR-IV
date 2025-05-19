require("dotenv").config();

module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorResponse = {
    success: false,
    error: {
      type: err.type || "server_error",
      message: err.clientMessage || err.message || "Erro interno no servidor",
      ...(process.env.NODE_ENV === "development" && {
        stack: err.stack,
        originalError: err.message,
      }),
      ...(err.details && { details: err.details }),
      ...(err.code && { code: err.code }),
    },
  };

  if (err.name === "SequelizeValidationError") {
    errorResponse.error.type = "database_validation_error";
    errorResponse.error.details = {
      fields: err.errors.reduce((acc, { path, message }) => {
        acc[path] = message;
        return acc;
      }, {}),
    };
  }

  if (err.isJoi) {
    errorResponse.error.type = "request_validation_error";
    errorResponse.error.details = {
      fields: err.details.reduce((acc, { path, message }) => {
        acc[path.join(".")] = message;
        return acc;
      }, {}),
    };
  }

  if (process.env.NODE_ENV === "development") {
    console.error("\x1b[31m--- ERRO DETALHADO ---\x1b[0m");
    console.error("Rota:", req.method, req.originalUrl);
    console.error("Código:", statusCode);
    console.error("Tipo:", errorResponse.error.type);
    console.error("Stack:", err.stack || "N/A");
  }

  res.status(statusCode).json(errorResponse);
};
