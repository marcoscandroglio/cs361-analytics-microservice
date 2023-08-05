const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');
const app = express();
const port = 3000;

// Connect to the PostgreSQL database
// the database name stored in databasName needs to already be set up in PostgreSQL
databaseName = 'CS361_Analytics_Microservice'
databasePassword = 'postgres_password'
const sequelize = new Sequelize(databaseName, 'postgres', databasePassword, {
  host: 'localhost',
  dialect: 'postgres',
});

// Define the Order model
// ############################################################################
// This need to be coordinated with the data attributes in the main application
// ############################################################################
const Order = sequelize.define('Order', {
  dish: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  // Add more fields as needed
});

// Sync the models with the database
sequelize.sync().then(() => {
  console.log('PostgreSQL database and tables are ready!');
});

// Middleware for parsing request bodies as JSON
app.use(bodyParser.json());

// Allow requests from all origins (replace "*" with the frontend's domain if known)
app.use(cors());

// Endpoint for saving an order to the database
app.post('/api/v1/orders', async (req, res) => {
  try {
    // ############################################################################
    // This need to be coordinated with the data attributes in the main application
    // ############################################################################
    const { dish, price, rating, date } = req.body;
    const order = await Order.create({ dish, price, rating, date });
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save the order.' });
  }
});

// Endpoint for retrieving popular dishes
app.get('/api/v1/analytics/popular_dishes', async (req, res) => {
  try {
    const popularDishes = await Order.findAll({
      attributes: ['dish', [Sequelize.fn('COUNT', Sequelize.col('id')), 'orderCount']],
      group: ['dish'],
      order: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'DESC']],
      limit: 5, // Limit to the top 5 popular dishes
    });
    res.json(popularDishes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch popular dishes.' });
  }
});

// Endpoint for retrieving order trends for a date range
app.get('/api/v1/analytics/order_trends', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const orderTrends = await Order.findAll({
      attributes: ['date', [Sequelize.fn('SUM', Sequelize.col('price')), 'revenue']],
      where: {
        date: {
          [Sequelize.Op.between]: [start_date, end_date],
        },
      },
      group: ['date'],
    });
    res.json(orderTrends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch order trends.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
