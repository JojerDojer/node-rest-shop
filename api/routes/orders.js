const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/orders');
const Product = require('../models/products')

router.get('/', async (req, res, next) => {
  try {
    const orders = await Order.find().populate('product', 'name');

    if(!orders) {
      const err = new Error('There are no orders found');
      err.status = 400;
      console.log('err:', err);
      next(err);
      return;
    }

    res.status(200).json({
      message: 'Orders were fetched',
      orders: orders
    });

  } catch (err) {
    console.log('err:', err);
    next(err);
  }
});

// Create order **FIX THIS ->>** This is creating products in the order that don't exist in the products collection.
router.post('/', async (req, res, next) => {
  try {
    // Check if the product exists in the Product collection
    const product = await Product.findById(req.body.product);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const order = new Order({
      product: req.body.product,
      quantity: req.body.quantity
    });

    const savedOrder = await order.save();

    res.status(201).json({
      message: 'Order successfully saved',
      order: order
    });

  } catch (err) {
    console.log(err);
    next(err)
  }
});

// Find a specific order by ID
router.get('/:orderId', async (req, res, next) => {
  try {
    let id = req.params.orderId;

    // Error handling for invalid Object ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error('The ID you entered is not a valid Object ID');
      err.status = 400;
      console.log('err:', err);
      next(err);
      return;
    }

    // Find order by ID
    const findById = await Order.findById(id).populate('product');

    // Error handling for ID that does not exist
    if (!findById) {
      const err = new Error('The ID you entered does not exist');
      err.status = 404;
      console.log('err:', err);
      next(err);
      return;
    }

    // Respond with status code and order data
    res.status(200).json({
      message: 'Order successfully retrieved',
      order: findById
    })

  } catch (err) {
    console.log('err:', err);
    next(err);
  }
});

router.delete('/:orderId', async (req, res, next) => {
  try {
    let id = req.params.orderId;

    // Error handling for invalid Object ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error('The ID you entered is not a valid Object ID');
      err.status = 400;
      console.log('err:', err);
      next(err);
      return;
    }

    const deleteOrder = await Order.findOneAndDelete({ _id: id });

    // Error handling for ID that does not exist
    if (!deleteOrder) {
      const err = new Error('The ID you entered does not exist');
      err.status = 404;
      console.log('err:', err);
      next(err);
      return;
    }

    // Respond with status code and data deleted
    res.status(200).json({
      message: "Order deleted",
      order: deleteOrder
    });

  } catch (err) {
    console.log('err:', err);
    next(err);
  }
});

module.exports = router;
