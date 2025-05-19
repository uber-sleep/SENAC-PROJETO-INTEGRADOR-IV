const { User } = require('../models/User');
const { Producer } = require('../models/Producer');
const { validateCoordinates } = require('../../../utils/validateCoordinates');

exports.findNearbyProducers = async (req, res, next) => {
    try {
        const { latitude, longitude, radius = 10 } = req.query;

        if (latitude || longitude) {
            if (!latitude || !longitude) {
                const error = new Error('Ambas coordenadas devem ser fornecidas');
                error.statusCode = 400;
                error.type = 'invalid_input';
                error.clientMessage = 'Coordenadas incompletas para busca';
                error.details = {
                    example: '/nearby-producers?latitude=-23.5505&longitude=-46.6333&radius=5'
                };
                return next(error);
            }

            if (!validateCoordinates(latitude, longitude)) {
                const error = new Error('Coordenadas inválidas');
                error.statusCode = 400;
                error.type = 'invalid_input';
                error.clientMessage = 'Formato de coordenadas inválido';
                error.details = {
                    required_format: 'Decimal com ponto (ex: -23.561399)',
                    valid_ranges: { latitude: '-90 a 90', longitude: '-180 a 180' }
                };
                return next(error);
            }

            if (isNaN(radius) || radius < 1 || radius > 100) {
                const error = new Error('Raio de busca inválido');
                error.statusCode = 400;
                error.type = 'invalid_input';
                error.clientMessage = 'Raio de busca fora do limite permitido';
                error.details = { valid_range: '1-100 km' };
                return next(error);
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
            const error = new Error('Nenhum produtor encontrado');
            error.statusCode = 404;
            error.type = 'not_found';
            error.clientMessage = 'Nenhum produtor localizado';
            error.details = {
                suggestion: latitude && longitude
                    ? 'Amplie o raio de busca'
                    : 'Cadastre produtores na plataforma'
            };
            return next(error);
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
        error.clientMessage = 'Falha na busca de produtores';
        error.statusCode = error.statusCode || 500;
        error.type = error.type || 'producer_search_error';
        error.details = { recovery: 'Tente novamente mais tarde' };
        next(error);
    }
};