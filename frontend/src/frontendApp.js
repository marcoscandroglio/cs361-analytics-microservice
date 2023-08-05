// MainApp.js (Frontend)
// Note: change frontend port number under "scripts" in package.json

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

const MainApp = () => {
  const [dish, setDish] = useState('');
  const [price, setPrice] = useState('');
  const [rating, setRating] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [date, setDate] = useState('');
  const [orderTrendsData, setOrderTrendsData] = useState([]);
  const [popularDishesData, setPopularDishesData] = useState([]);



  // References to the Chart instances
  const orderTrendsChartRef = React.useRef(null);
  const popularDishesChartRef = React.useRef(null);

  const createOrderTrendsChart = (data) => {
    // Check if a previous Chart instance exists, and destroy it before creating a new one
    if (orderTrendsChartRef.current) {
      orderTrendsChartRef.current.destroy();
    }

    // Create the new Chart instance
    orderTrendsChartRef.current = new Chart(document.getElementById('orderTrendsChart'), {
      type: 'line',
      data: {
        labels: data.map((trend) => trend.date),
        datasets: [
          {
            label: 'Revenue',
            data: data.map((trend) => trend.revenue),
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            fill: false,
          },
        ],
      },
    });
  };

  const createPopularDishesChart = (data) => {
    // Check if a previous Chart instance exists, and destroy it before creating a new one
    if (popularDishesChartRef.current) {
      popularDishesChartRef.current.destroy();
    }

    // Create the new Chart instance
    popularDishesChartRef.current = new Chart(document.getElementById('popularDishesChart'), {
      type: 'bar',
      data: {
        labels: data.map((dish) => dish.dish),
        datasets: [
          {
            label: 'Order Count',
            data: data.map((dish) => dish.orderCount),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
    });
  };

  useEffect(() => {
    // Fetch order trends data on component mount
    axios
      .get(`http://localhost:3000/api/v1/analytics/order_trends`)
      .then((response) => {
        setOrderTrendsData(response.data);
        createOrderTrendsChart(response.data);
      })
      .catch((error) => {
        console.error('Error:', error.message);
      });

    // Fetch popular dishes data on component mount
    axios
      .get('http://localhost:3000/api/v1/analytics/popular_dishes')
      .then((response) => {
        setPopularDishesData(response.data);
        createPopularDishesChart(response.data);
      })
      .catch((error) => {
        console.error('Error:', error.message);
      });
  }, []);

  const handleSubmitDish = (event) => {
    // ############################################################################
    // This need to be coordinated with the order process in the main application
    // ############################################################################
    event.preventDefault();

    // Send dish data to the backend
    axios
      .post('http://localhost:3000/api/v1/orders', { dish, price: parseFloat(price), rating: parseFloat(rating), date })
      .then((response) => {
        console.log('Order added successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error:', error.message);
      });
  };

  const handleSubmitDateRange = (event) => {
    event.preventDefault();

    // Send date range data to the backend to retrieve order trends
    axios
      .get(`http://localhost:3000/api/v1/analytics/order_trends?start_date=${startDate}&end_date=${endDate}`)
      .then((response) => {
        setOrderTrendsData(response.data);
        createOrderTrendsChart(response.data);
      })
      .catch((error) => {
        console.error('Error:', error.message);
      });
  };

  const handleGetPopularDishes = (event) => {
    event.preventDefault();

    // Send request to the backend to retrieve popular dishes
    axios
      .get('http://localhost:3000/api/v1/analytics/popular_dishes')
      .then((response) => {
        setPopularDishesData(response.data);
        createPopularDishesChart(response.data);
      })
      .catch((error) => {
        console.error('Error:', error.message);
      });
  };

  return (
    <div>
      {/* Form for entering dish attributes */}
      {/* ############################################################################
          This form will likely be removed during integration
          ############################################################################ */}
      <form onSubmit={handleSubmitDish}>
        <h2>Enter Dish Attributes</h2>
        <label>
          Dish:
          <input type="text" value={dish} onChange={(e) => setDish(e.target.value)} required />
        </label>
        <label>
          Price:
          <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </label>
        <label>
          Rating:
          <input type="number" step="0.1" value={rating} onChange={(e) => setRating(e.target.value)} required />
        </label>

        <label>
          Date:
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>
        <button type="submit">Submit</button>
      </form>

      {/* Form for selecting a date range and retrieving order trends */}
      <form onSubmit={handleSubmitDateRange}>
        <h2>Retrieve Order Trends</h2>
        <label>
          Start Date:
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </label>
        <label>
          End Date:
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        </label>
        <button type="submit">Retrieve Trends</button>
      </form>

      {/* Button to get popular dishes */}
      <button onClick={handleGetPopularDishes}>Get Popular Dishes</button>

      {/* Chart to display order trends */}
      <h2>Order Trends</h2>
      <canvas id="orderTrendsChart" width="400" height="200"></canvas>

      {/* Chart to display popular dishes */}
      <h2>Popular Dishes</h2>
      <canvas id="popularDishesChart" width="400" height="200"></canvas>
    </div>
  );
};

export default MainApp;
