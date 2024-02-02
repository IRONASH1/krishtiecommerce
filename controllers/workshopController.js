// controllers/productsController.js
const Product = require('../models/workshopProductModel');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const multer = require("multer");
const path = require("path");

// const { v4: uuidv4 } = require('uuid');
// const generateStudentId = () => {
//   return uuidv4();
// };



// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'../views')));

app.use(express.static('public'));

const storage = multer.diskStorage({
    destination:function(req,file,cb){
       cb(null,path.join(__dirname, '../public'));
    },
    filename:function(req,file,cb){
       const name = Date.now()+'-'+file.originalname;
       cb(null,name);
    }
});
const upload = multer({storage:storage});



// to list all product
const listProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ created_at: -1 });;
    res.render('workshopProduct/index', { products });
  } catch (error) {
    console.error('Error listing products:', error);
    res.status(500).send('Error listing products');
  }
};

// sent on create page
const renderCreateForm = (req, res) => {
  res.render('workshopProduct/create');
};


const createProduct = async (req, res) => {
  try {
    const { title, description, price, moc, workshop } = req.body;
    const image1 = req.files.image1;

    const imagePath1 = 'workshopuploads/' + image1.name;

    image1.mv(path.join(__dirname, '../public', imagePath1));

    // Access the field as an array
    const scheduledDateTimes = req.body['scheduledDateTimes[]'];

    let scheduledDateTimesArray = [];

    // Check if scheduledDateTimes is defined and is an array
    if (Array.isArray(scheduledDateTimes)) {
      // Map over the array and convert each element to a Date object
      scheduledDateTimesArray = scheduledDateTimes.map(dateTime => new Date(dateTime));
    } else if (scheduledDateTimes) {
      // If it's a single value, convert it to an array with a single element
      scheduledDateTimesArray = [new Date(scheduledDateTimes)];
    }

    const newProduct = new Product({
      title,
      workshop,
      description,
      price,
      moc,
      image1: imagePath1,
      scheduledDateTimes: scheduledDateTimesArray,
    });

    await newProduct.save();
    res.redirect('/admin/workshopProduct');
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).send('Error creating product');
  }
};


const renderEditForm = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).send('Product not found');
    }

    res.render('workshopProduct/edit', { product });
  } catch (error) {
    console.error('Error loading edit form:', error);
    res.status(500).send('Error loading edit form');
  }
};

const editProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { title, description,price,moc,workshop } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).send('Product not found');
    }

    if (req.files && req.files.image1) {
      const image1 = req.files.image1;

        // Delete the old images
        if (product.image1) {
          fs.unlinkSync(path.join(__dirname, '../public', product.image1));
        }
      const imagePath1 = 'workshopuploads/' + image1.name;

      image1.mv(path.join(__dirname, '../public', imagePath1));

      product.image1 = imagePath1;
    }

    product.title = title;
    product.workshop = workshop;
    product.description = description;
    product.price = price;
    product.moc = moc;
    await product.save();

    res.redirect('/admin/workshopProduct');
  } catch (error) {
    console.error('Error editing product:', error);
    res.status(500).send('Error editing product');
  }
};


const renderDeleteForm = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render('workshopProduct/delete', { product });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).send('Error deleting product');
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).send('Product not found');
    }

    // Delete the images from the 'uploads' folder
    if (product.image1) {
      const image1Path = path.join(__dirname, '../public', product.image1);
      fs.unlinkSync(image1Path); // Delete image1
    }
    

    await Product.findByIdAndRemove(productId);

    res.redirect('/admin/workshopProduct');
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).send('Error deleting product');
  }
};

module.exports = {
  listProducts,
  renderCreateForm,
  createProduct,
  renderEditForm,
  editProduct,
  renderDeleteForm,
  deleteProduct

}