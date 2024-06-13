
// Import statements
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/products'); // product model

router.get('/', async(req, res, next) => {
  try {
    const products = await Product.find();

    if (!products) {
      const err = new Error('There are no products available');
      res.status = 400;
      console.log('err', err);
      next(err);
      return;
    }

    res.status(200).send(products);


  } catch (err) {
    console.log('err', err);
    next(err);
  }
});

router.post('/', (req, res, next) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price
  });
  product.save().then(result => {
    console.log(result);
    res.status(201).json({
      message: 'Created product successfully',
      createdProduct: product
    });
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      message: 'A problem occurred!',
      error: err
    });
  });
});

// API for retrieving a specific productId
router.get('/:productId', async (req, res, next) => {

  try {
    let id = req.params.productId;

    // Validate if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error('The ID you entered is not a valid Object ID')
      err.status = 400;
      console.log('err', err);
      next(err);
      return;
    }

    const findById = await Product.findById(id);

    // Checks if the ID exists
    if(!findById) {
      const err = new Error('The ID you entered does not exist');
      err.status = 404;
      console.log('err', err);
      next(err);
      return;
    }

    res.status(200).json({
      message: 'Product successfully retrieved.',
      data: findById
    });

  } catch (err) {
    console.error('err', err)
    next(err);
  }
});



router.patch('/:productId', (req, res, next) => {
  res.status(200).json({
    message: 'Updated product!'
  })
});

router.delete('/:productId', async (req, res, next) => {
  try {
    let id = req.params.productId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error('The ID you entered is not a valid Object ID');
      err.status = 400;
      console.log('err', err);
      next(err);
      return;
    }

    const deletedProduct = await Product.findOneAndDelete({ _id: id});

    if (!deletedProduct) {
      const err = new Error('The ID you searched for does not exist');
      err.status = 404;
      console.log('err', err);
      next(err);
      return;
    }

    res.status(200).json({
      message: 'The product was deleted successfully!',
      deletedProduct
    });

  } catch (err) {
    console.log('err', err);
    next(err);
  }
});


module.exports = router;
