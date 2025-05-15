module.exports = {
    validateUpdateFields: (body) => {
        const allowedFields = ['name', 'phone', 'address'];
        const invalidFields = Object.keys(body).filter(field => !allowedFields.includes(field));

        if (invalidFields.length > 0) {
            return {
                valid: false,
                error: `Campos inválidos para atualização: ${invalidFields.join(', ')}`
            };
        }
        
        return { valid: true };
    }
};