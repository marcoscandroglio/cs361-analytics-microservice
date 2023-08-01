# cs361-analytics-microservice

This microservice provides order storage and analytics for the online food ordering system.  It allows a user to programatically store and retreive data related to order revenue trends and dish popularity.  This implementation utilizes a PostgreSQL database.

A note on the endpoints shown below: The current implementation is configured to work on a single machine which is why the endpoints are prepended with "http://localhost:{port number}".


## Submitting Data

To submit data to the microservice an HTTP POST request containing the order data in JSON format is sent to the "orders" endpoint.

Submitting Dish Attributes - Use a POST request to submit dish attributes to add an order to the database.

Endpoint: http://localhost:3000/api/v1/orders
Method: POST
Request Body: JSON object with order attributes

### Example Data
```
{
  "dish": "Dish Name",
  "price": 8.99,
  "rating": 4.5,
  "date": "2023-07-28"
}
```

### Example Call (using Axios in JavaScript):
```
axios.post('http://localhost:3000/api/v1/orders', {
  dish: "Burger",
  price: 5.99,
  rating: 4.8,
  date: "2023-07-25"
})
.then((response) => {
  console.log('Order added successfully:', response.data);
})
.catch((error) => {
  console.error('Error:', error.message);
});
```


## Requesting Data

To request data from the microservice, you need to send HTTP requests to the appropriate endpoints using the specified HTTP GET requests.

### Retrieving Order Trends

Use a GET request with date range parameters to retrieve order trends data.

Endpoint: http://localhost:3000/api/v1/analytics/order_trends
Method: GET
Query Parameters: start_date (string in the format 'YYYY-MM-DD') and end_date (string in the format 'YYYY-MM-DD')

### Example Query:

http://localhost:3000/api/v1/analytics/order_trends?start_date=2023-07-01&end_date=2023-07-31

### Example Call (using Axios in JavaScript):
```
axios.get('http://localhost:3000/api/v1/analytics/order_trends?start_date=2023-07-01&end_date=2023-07-31')
.then((response) => {
  console.log('Order trends data:', response.data);
})
.catch((error) => {
  console.error('Error:', error.message);
});
```

### Getting Popular Dishes

Use a GET request to retrieve data on popular dishes.

Endpoint: http://localhost:3000/api/v1/analytics/popular_dishes
Method: GET

### Example Query:
```
http://localhost:3000/api/v1/analytics/popular_dishes
```

### Example Call (using Axios in JavaScript):
```
axios.get('http://localhost:3000/api/v1/analytics/popular_dishes')
.then((response) => {
  console.log('Popular dishes data:', response.data);
})
.catch((error) => {
  console.error('Error:', error.message);
});
```


## Receiving Data

The microservice responds to HTTP requests with JSON data. This microservice utilizes Axios to receive the data from the microservice. The data will be in JSON format containing the data specified in the database query so it can be used in the chart visualizations.


### Example Data (Order Trends)
```
[
  {"date": "2023-07-25T00:00:00.000Z", "revenue": 62.89},
  {"date": "2023-07-28T00:00:00.000Z", "revenue": 90.85},
  {"date": "2023-07-27T00:00:00.000Z", "revenue": 66.88},
  {"date": "2023-07-24T00:00:00.000Z", "revenue": 73.88},
  {"date": "2023-07-29T00:00:00.000Z", "revenue": 96.85},
  {"date": "2023-07-26T00:00:00.000Z", "revenue": 92.85}
]
```

### Example Data (Popular Dishes)
```
[
  {"dish": "Burger", "orderCount": "22"},
  {"dish": "Salad", "orderCount": "20"},
  {"dish": "Pizza", "orderCount": "15"},
  {"dish": "Soda", "orderCount": "15"},
  {"dish": "Chicken", "orderCount": "14"}
]
```
