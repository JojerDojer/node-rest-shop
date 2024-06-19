// Import statements
const express = require('express');
const app = express();
const morgan = require('morgan'); // npm package to log requests
const cors = require ('cors');
const mongoose = require('mongoose');

// Import APIs
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

// Connection to MongoDB
mongoose.connect('mongodb+srv://21418661:S3cret@bellevueuniversity.feyswh3.mongodb.net/').then(
  () => {
    console.log('Database connected!');
  },
  (err) => {
    console.log('MongoDB Error: ' + err.message);
  }
);

// Incorporate morgan and bodyParser
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Route handling
app.use('/products', productRoutes);
app.use('/orders', orderRoutes)

app.use((req, res, next) => {
  const error = new Error('The route you are looking for does not exist.');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
