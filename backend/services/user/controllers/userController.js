const { User } = require('../models');
const { handleSequelizeError } = require('../../../shared/utils/sequelizeErrorHandler');
const { validateUpdateFields } = require('../../../shared/utils/validateUpdateFields');

exports.getAllUsers = async (req, res) => {
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
        const { status, message } = handleSequelizeError(error);
        res.status(status || 500).json({
            error: message || 'Erro interno ao buscar usuários'
        });
    }
};

exports.getUserById = async (req, res) => {
    try {
        if (!req.params.id.match(/^\d+$/)) {
            return res.status(400).json({ error: 'ID do usuário inválido' });
        }

        const user = await User.findByPk(req.params.id, {
            attributes: ['id', 'name', 'email', 'phone', 'address'],
          });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.json(user);
    } catch (error) {
        console.error('Erro em getUserById:', error);
        const { status, message } = handleSequelizeError(error);
        res.status(status || 500).json({
            error: message || 'Erro interno ao buscar usuário'
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        if (req.user.id !== parseInt(req.params.id)) {
            return res.status(403).json({ error: 'Você só pode editar seu próprio perfil' });
        }

        const { valid, error } = validateUpdateFields(req.body);
        if (!valid) return res.status(400).json({ error });

        const [updatedCount] = await User.update(req.body, {
            where: { id: req.params.id },
            fields: ['name', 'phone', 'address'] 
          });

        if (updatedCount === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
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
        const { status, message } = handleSequelizeError(error);
        res.status(status || 500).json({
            error: message || 'Erro interno ao atualizar usuário'
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id, 10);

        if (req.user.id !== userId) {
            return res.status(403).json({ error: 'Você só pode deletar sua própria conta' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Exclusão suave
        await User.update({ active: false }, { where: { id: userId } });

        res.json({ message: 'Conta desativada com sucesso' });
    } catch (error) {
        console.error('Erro em deleteUser:', error);

        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(409).json({
                error: 'Não é possível excluir usuário com registros dependentes'
            });
        }

        const { status, message } = handleSequelizeError(error);
        res.status(status || 500).json({
            error: message || 'Erro interno ao desativar usuário'
        });
    }
};  