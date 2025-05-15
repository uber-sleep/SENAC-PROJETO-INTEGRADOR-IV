const { User } = require('../models');
const { handleSequelizeError } = require('../../../shared/utils/sequelizeErrorHandler');
const { validateUpdateFields } = require('../../../shared/utils/validateUpdateFields');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
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
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Consumer,
                    required: false,
                },
                {
                    model: Producer,
                    required: false,
                    attributes: ['cpf_cnpj', 'certificate_id']
                }
            ]
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
        const { valid, error } = validateUpdateFields(req.body);
        if (!valid) return res.status(400).json({ error });

        const [updatedCount] = await User.update(req.body, {
            where: { id: req.params.id },
            fields: ['name', 'phone', 'address'],
            individualHooks: true
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
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const deleted = await User.destroy({
            where: { id: req.params.id },
            individualHooks: true
        });

        res.json({
            message: 'Usuário deletado com sucesso',
            deletedCount: deleted
        });
    } catch (error) {
        console.error('Erro em deleteUser:', error);

        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(409).json({
                error: 'Não é possível excluir usuário com registros dependentes'
            });
        }

        const { status, message } = handleSequelizeError(error);
        res.status(status || 500).json({
            error: message || 'Erro interno ao excluir usuário'
        });
    }
};