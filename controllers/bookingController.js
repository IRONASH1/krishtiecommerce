// controllers/productsController.js
const Product = require('../models/bookingModel');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const multer = require("multer");
const path = require("path");

const { v4: uuidv4 } = require('uuid');
const generateStudentId = () => {
  return uuidv4();
};



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
    res.render('booking/index', { products });
  } catch (error) {
    console.error('Error listing products:', error);
    res.status(500).send('Error listing products');
  }
};

// sent on create page
const renderCreateForm = (req, res) => {
  res.render('booking/create');
};


const renderEditForm = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).send('Product not found');
    }

    res.render('booking/edit', { product });
  } catch (error) {
    console.error('Error loading edit form:', error);
    res.status(500).send('Error loading edit form');
  }
};

const editProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, mno,email, price, moc, workshop ,is_payment } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).send('Product not found');
    }

    product.name = name;
    product.mno = mno;
    product.email = email;
    product.price = price;
    product.moc = moc;
    product.workshop = workshop;
    product.is_payment = is_payment;
    await product.save();

    res.redirect('/admin/booking');
  } catch (error) {
    console.error('Error editing product:', error);
    res.status(500).send('Error editing product');
  }
};


const renderDeleteForm = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render('booking/delete', { product });
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

    await Product.findByIdAndRemove(productId);

    res.redirect('/admin/booking');
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).send('Error deleting product');
  }
};

module.exports = {
  listProducts,
  renderCreateForm,
  renderEditForm,
  editProduct,
  renderDeleteForm,
  deleteProduct

}