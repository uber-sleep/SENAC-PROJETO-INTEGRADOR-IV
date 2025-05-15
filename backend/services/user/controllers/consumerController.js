const { Consumer, Producer, User } = require('../models');
const { handleSequelizeError } = require('../../../shared/utils/sequelizeErrorHandler');
const { validateCoordinates } = require('../../../shared/utils/validators/coordinatesValidator'); 

exports.findNearbyProducers = async (req, res) => {
    try {
        const { latitude, longitude, radius = 10 } = req.query;

        if (latitude || longitude) {
            if (!latitude || !longitude) {
                return res.status(400).json({
                    error: 'Ambas coordenadas (latitude e longitude) devem ser fornecidas',
                    example: '/producers/nearby?latitude=-23.5505&longitude=-46.6333&radius=5'
                });
            }

            if (!validateCoordinates(latitude, longitude)) {
                return res.status(400).json({
                    error: 'Coordenadas inválidas',
                    required_format: 'Decimal com ponto ex: -23.561399',
                    valid_ranges: {
                        latitude: '-90 a 90',
                        longitude: '-180 a 180'
                    }
                });
            }

            if (isNaN(radius) || radius < 1 || radius > 100) {
                return res.status(400).json({
                    error: 'Raio de busca inválido',
                    valid_range: '1-100 km'
                });
            }
        }

        // Lógica de consulta simulada
        const producers = await Producer.findAll({
            where: {
                // simulação
                '$User.address$': {
                    [Sequelize.Op.ne]: null
                }
            },
            include: [{
                model: User,
                attributes: ['id', 'name', 'address', 'phone'],
                required: true
            }],
            limit: 50,
            order: [[User, 'address', 'ASC']]
        });

        const results = producers.map(producer => ({
            id: producer.id,
            name: producer.User.name,
            address: producer.User.address,
            distance: latitude && longitude
                ? `${Math.random() * radius} km` // simulação
                : 'N/D'
        }));

        if (results.length === 0) {
            return res.status(404).json({
                message: 'Nenhum produtor encontrado',
                suggestion: 'Tente ampliar o raio de busca'
            });
        }

        res.json({
            search_parameters: {
                latitude: latitude || 'Não informada',
                longitude: longitude || 'Não informada',
                radius: `${radius} km`
            },
            count: results.length,
            results
        });

    } catch (error) {
        console.error('Erro na busca de produtores:', {
            params: req.query,
            error: error.stack
        });

        const { status, message } = handleSequelizeError(error);
        res.status(status || 500).json({
            error: message || 'Falha na busca de produtores',
            troubleshooting: 'Verifique os parâmetros ou tente novamente mais tarde'
        });
    }
};