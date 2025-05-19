const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const { Consumer } = require('../models/Consumer');
const { Producer } = require('../models/Producer');

exports.signup = async (req, res, next) => {
    try {
        const requiredFields = ['name', 'email', 'password', 'phone', 'address', 'role'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            const error = new Error('Campos obrigatórios faltando');
            error.statusCode = 400;
            error.type = 'invalid_input';
            error.clientMessage = 'Dados incompletos para cadastro';
            error.details = { missing_fields: missingFields };
            return next(error);
        }

        const { name, email, password, phone, address, role } = req.body;

        if (!['consumer', 'producer'].includes(role)) {
            const error = new Error('Tipo de usuário inválido');
            error.statusCode = 400;
            error.type = 'invalid_role';
            error.clientMessage = 'Tipo de conta não reconhecido';
            error.details = { valid_roles: ['consumer', 'producer'] };
            return next(error);
        }

        if (role === 'producer' && !req.body.cpf_cnpj) {
            const error = new Error('CPF/CNPJ obrigatório');
            error.statusCode = 400;
            error.type = 'missing_document';
            error.clientMessage = 'Documento é necessário para produtores';
            return next(error);
        }

        const user = await User.create({ name, email, password, phone, address });

        if (role === 'consumer') {
            await Consumer.create({ id: user.id });
        } else {
            await Producer.create({
                id: user.id,
                cpf_cnpj: req.body.cpf_cnpj
            });
        }

        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role
        });

    } catch (error) {
        error.clientMessage = 'Falha no cadastro do usuário';
        error.statusCode = error.statusCode || 500;
        error.type = error.type || 'user_creation_error';
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        if (!req.body.email || !req.body.password) {
            const error = new Error('Credenciais incompletas');
            error.statusCode = 400;
            error.type = 'missing_credentials';
            error.clientMessage = 'Email e senha são obrigatórios';
            return next(error);
        }

        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        const validPassword = user ? await bcrypt.compare(password, user.password) : false;

        if (!user || !validPassword) {
            const error = new Error('Credenciais inválidas');
            error.statusCode = 401;
            error.type = 'auth_failed';
            error.clientMessage = 'Combinação email/senha incorreta';
            return next(error);
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        error.clientMessage = 'Falha no processo de login';
        error.statusCode = error.statusCode || 500;
        error.type = error.type || 'auth_error';
        next(error);
    }
};

exports.logout = (req, res, next) => {
    try {
        res.status(200).json({ message: "Logout realizado com sucesso" });
    } catch (error) {
        error.clientMessage = 'Erro durante o logout';
        error.statusCode = 500;
        error.type = 'logout_error';
        next(error);
    }
};