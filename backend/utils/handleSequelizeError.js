module.exports = {
    handleSequelizeError: (error) => {
        if (error.name === 'SequelizeUniqueConstraintError') {
            const field = error.errors[0].path;
            return {
                status: 409,
                message: `${field.charAt(0).toUpperCase() + field.slice(1)} já está em uso`
            };
        }

        if (error.name === 'SequelizeValidationError') {
            const messages = error.errors.map(err => err.message);
            return { status: 400, message: messages.join('; ') };
        }
        
        return { status: 400, message: error.message };
    }
  };