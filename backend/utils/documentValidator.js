const { validateBr } = require('js-brasil');

const documentValidator = {
    validate(document) {
        const cleanDoc = (document || '').replace(/\D/g, '');
        return validateBr.cpf(cleanDoc) || validateBr.cnpj(cleanDoc);
    },

    format(document) {
        const cleanDoc = (document || '').replace(/\D/g, '');

        if (cleanDoc.length === 11) {
            return cleanDoc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }

        if (cleanDoc.length === 14) {
            return cleanDoc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }

        return null;
    },

    fullValidation(document) {
        const isValid = this.validate(document);
        const formatted = this.format(document);
        return { isValid, formatted };
    }
};

module.exports = documentValidator;