const { Producer, User } = require('../models');
const { handleSequelizeError } = require('../../../shared/utils/sequelizeErrorHandler');
const { validateCoordinates } = require('../../../shared/utils/validators/coordinatesValidator');

exports.findNearbyProducers = async (req, res) => {
    try {
        const { latitude, longitude, radius = 10 } = req.query;

        if (latitude || longitude) {
            if (!latitude || !longitude) {
                return res.status(400).json({
                    error: 'Ambas coordenadas (latitude e longitude) devem ser fornecidas',
                    example: '/nearby-producers?latitude=-23.5505&longitude=-46.6333&radius=5'
                });
            }

            if (!validateCoordinates(latitude, longitude)) {
                return res.status(400).json({
                    error: 'Coordenadas inválidas',
                    required_format: 'Decimal com ponto (ex: -23.561399)',
                    valid_ranges: { latitude: '-90 a 90', longitude: '-180 a 180' }
                });
            }

            if (isNaN(radius) || radius < 1 || radius > 100) {
                return res.status(400).json({
                    error: 'Raio de busca inválido',
                    valid_range: '1-100 km'
                });
            }
        }

        const producers = await Producer.findAll({
            include: [{
                model: User,
                attributes: ['id', 'name', 'address', 'phone'],
                where: { active: true }, 
                required: true
            }],
            limit: 50, 
            order: [[User, 'name', 'ASC']] 
        });

        const results = producers.map(producer => ({
            id: producer.id,
            name: producer.User.name,
            address: producer.User.address,
            phone: producer.User.phone,
            distance: latitude && longitude
                ? `${(Math.random() * radius).toFixed(1)} km`
                : 'N/D'
        }));

        if (results.length === 0) {
            return res.status(404).json({
                message: 'Nenhum produtor encontrado',
                suggestion: latitude && longitude
                    ? 'Amplie o raio de busca'
                    : 'Cadastre produtores na plataforma'
            });
        }

        res.json({
            search_params: {
                latitude: latitude || 'Não informada',
                longitude: longitude || 'Não informada',
                radius: `${radius} km`
            },
            count: results.length,
            producers: results
        });

    } catch (error) {
        console.error('Erro em findNearbyProducers:', error);
        const { status, message } = handleSequelizeError(error);
        res.status(status || 500).json({
            error: message || 'Erro ao buscar produtores',
            recovery: 'Tente novamente mais tarde'
        });
    }
};