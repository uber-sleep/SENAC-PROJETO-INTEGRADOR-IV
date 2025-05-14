const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Consumer, Producer } = require('../models');
const { handleSequelizeError } = require('../../../shared/utils/sequelizeErrorHandler');

exports.signup = async (req, res) => {
    try {
        const requiredFields = ['name', 'email', 'password', 'phone', 'address', 'role'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: `Campos obrigatórios faltando: ${missingFields.join(', ')}`
            });
        }

        const { name, email, password, phone, address, role } = req.body;
        
        if (!['consumer', 'producer'].includes(role)) {
            return res.status(400).json({ error: 'Tipo de usuário inválido' });
        }

        if (role === 'producer' && !req.body.cpf_cnpj) {
            return res.status(400).json({ error: 'CPF/CNPJ é obrigatório para produtores' });
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
        const { status, message } = handleSequelizeError(error);
        res.status(status).json({ error: message });    
    }
};

exports.login = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        const validPassword = user ? await bcrypt.compare(password, user.password) : false;

        if (!user || !validPassword) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
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
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

exports.logout = (req, res) => {
    try {
        res.status(200).json({ message: "Logout realizado com sucesso" });
    } catch (error) {
        res.status(500).json({ error: 'Erro durante o logout' });
    }
};