// controllers/productsController.js
const Product = require('../models/productModel');
const fs = require('fs');
const express = require('express');
const app = express();
const multer = require("multer");
const path = require("path");

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
    res.render('homeProduct/index', { products });
  } catch (error) {
    console.error('Error listing products:', error);
    res.status(500).send('Error listing products');
  }
};

// sent on create page
const renderCreateForm = (req, res) => {
  res.render('homeProduct/create');
};

// create product from here
const createProduct = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image1 = req.files.image1;
    const image2 = req.files.image2;

    const imagePath1 = 'uploads/' + image1.name;
    const imagePath2 = 'uploads/' + image2.name;

    image1.mv(path.join(__dirname, '../public', imagePath1));
    image2.mv(path.join(__dirname, '../public', imagePath2));

    const newProduct = new Product({
      title,
      description,
      image1: imagePath1,
      image2: imagePath2,
    });

    await newProduct.save();
    res.redirect('/admin/homeProduct');
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

    res.render('homeProduct/edit', { product });
  } catch (error) {
    console.error('Error loading edit form:', error);
    res.status(500).send('Error loading edit form');
  }
};

const editProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { title, description } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).send('Product not found');
    }

    if (req.files && req.files.image1 && req.files.image2) {
      const image1 = req.files.image1;
      const image2 = req.files.image2;

      const imagePath1 = 'uploads/' + image1.name;
      const imagePath2 = 'uploads/' + image2.name;

      image1.mv(path.join(__dirname, '../public', imagePath1));
      image2.mv(path.join(__dirname, '../public', imagePath2));

      product.image1 = imagePath1;
      product.image2 = imagePath2;
    }

    product.title = title;
    product.description = description;
    await product.save();

    res.redirect('/admin/homeProduct');
  } catch (error) {
    console.error('Error editing product:', error);
    res.status(500).send('Error editing product');
  }
};


const renderDeleteForm = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render('homeProduct/delete', { product });
  } catch (error) {
    console.error('page not found:', error);
    res.status(500).send('page not found');
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
    if (product.image2) {
      const image2Path = path.join(__dirname, '../public', product.image2);
      fs.unlinkSync(image2Path); // Delete image2
    }

    await Product.findByIdAndRemove(productId);

    res.redirect('/admin/homeProduct');
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