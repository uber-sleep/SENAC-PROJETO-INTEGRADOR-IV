const { User } = require('../models/User');
const { validateUpdateFields } = require('../../../utils/validateUpdateFields');

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'role'],
            limit: 100,
            order: [['createdAt', 'DESC']]
        });

        if (users.length === 0) {
            return res.status(200).json({ message: 'Nenhum usuário encontrado' });
        }

        res.json(users);
    } catch (error) {
        console.error('Erro em getAllUsers:', error);
        error.clientMessage = 'Falha ao buscar usuários';
        error.statusCode = 500;
        error.type = 'user_fetch_error';
        next(error);
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        if (!req.params.id.match(/^\d+$/)) {
            const error = new Error('ID do usuário inválido');
            error.statusCode = 400;
            error.type = 'invalid_input';
            error.clientMessage = 'Identificador de usuário inválido';
            return next(error);
        }

        const user = await User.findByPk(req.params.id, {
            attributes: ['id', 'name', 'email', 'phone', 'address'],
        });

        if (!user) {
            const error = new Error('Usuário não encontrado');
            error.statusCode = 404;
            error.type = 'not_found';
            error.clientMessage = 'Usuário não localizado';
            return next(error);
        }

        res.json(user);
    } catch (error) {
        console.error('Erro em getUserById:', error);
        error.clientMessage = 'Falha ao buscar usuário';
        error.statusCode = error.statusCode || 500;
        error.type = error.type || 'user_search_error';
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        if (req.user.id !== parseInt(req.params.id)) {
            const error = new Error('Acesso negado');
            error.statusCode = 403;
            error.type = 'forbidden';
            error.clientMessage = 'Você só pode editar seu próprio perfil';
            return next(error);
        }

        const { valid, error: validationError } = validateUpdateFields(req.body);
        if (!valid) {
            const error = new Error(validationError);
            error.statusCode = 400;
            error.type = 'invalid_input';
            error.clientMessage = 'Dados de atualização inválidos';
            return next(error);
        }

        const [updatedCount] = await User.update(req.body, {
            where: { id: req.params.id },
            fields: ['name', 'phone', 'address']
        });

        if (updatedCount === 0) {
            const error = new Error('Usuário não encontrado');
            error.statusCode = 404;
            error.type = 'not_found';
            error.clientMessage = 'Usuário não localizado para atualização';
            return next(error);
        }

        const updatedUser = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] }
        });

        res.json({
            message: 'Usuário atualizado com sucesso',
            user: updatedUser
        });
    } catch (error) {
        console.error('Erro em updateUser:', error);
        error.clientMessage = 'Falha na atualização do usuário';
        error.statusCode = error.statusCode || 500;
        error.type = error.type || 'user_update_error';
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id, 10);

        if (req.user.id !== userId) {
            const error = new Error('Acesso negado');
            error.statusCode = 403;
            error.type = 'forbidden';
            error.clientMessage = 'Você só pode deletar sua própria conta';
            return next(error);
        }

        const user = await User.findByPk(userId);
        if (!user) {
            const error = new Error('Usuário não encontrado');
            error.statusCode = 404;
            error.type = 'not_found';
            error.clientMessage = 'Usuário não localizado para exclusão';
            return next(error);
        }

        await User.update({ active: false }, { where: { id: userId } });

        res.json({ message: 'Conta desativada com sucesso' });
    } catch (error) {
        console.error('Erro em deleteUser:', error);

        if (error.name === 'SequelizeForeignKeyConstraintError') {
            error.statusCode = 409;
            error.type = 'dependency_conflict';
            error.clientMessage = 'Existem registros dependentes deste usuário';
            error.details = { recovery: 'Remova os registros associados antes de desativar' };
        }

        error.statusCode = error.statusCode || 500;
        error.type = error.type || 'user_deletion_error';
        error.clientMessage = error.clientMessage || 'Falha ao desativar usuário';
        next(error);
    }
};