const express = require('express');
const cors = require('cors');
const errorHandler = require('../middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));

const authRoutes = require('../services/user/routes/authRoutes');
const consumerRoutes = require('../services/user/routes/consumerRoutes');
const producerRoutes = require('../services/user/routes/producerRoutes');
const userRoutes = require('../services/user/routes/userRoutes');
const productRoutes = require('../services/product/routes/productRoutes');
const orderRoutes = require('../services/order/routes/orderRoutes');

app.use('/auth', authRoutes);
app.use('/consumers', consumerRoutes);
app.use('/producers', producerRoutes);
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);


app.use(errorHandler);

module.exports = app;