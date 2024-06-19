
// Import statements
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer'); // Import multer for handling file uploads

// Configuring multer storage and file name.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage });

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

router.post('/', upload.single('productImage'), async (req, res, next) => {

  try {

    console.log(req.file);
    const file = req.file; // store the requested file as a variable.

    // Error handling to ensure the file type is image.
    if (!file.mimetype.startsWith('image/')) {
      const err = new Error('Invalid file type. The file must be an image');
      err.status = 400;
      console.log('err:', err);
      next(err);
      return;
    }
    // Create a new instance of a product document
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      productImage: req.file.path
    });

    // Save the new product to database
    const savedProduct = await product.save();

    // Respond with status code and product data
    res.status(201).json({
      message: 'Created product Successfully',
      createdProduct: savedProduct
    });

  } catch (err) {
    console.log('err:', err)
    next(err);
  }
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



router.patch('/:productId', async (req, res, next) => {
  try {
    let id = req.params.productId;
    let updateData = { ...req.body};

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error('The ID you entered is not a valid Object ID');
      err.status = 400;
      console.log('err', err);
      next(err);
      return;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedProduct) {
      const err = new Error('Product was not found')
      err.status = 404;
      console.log('err', err);
      next(err);
      return;
    }

    res.status(200).send(updatedProduct);
  } catch (err) {
    console.log('Error updating product:', err);
    next(err);
  }
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
