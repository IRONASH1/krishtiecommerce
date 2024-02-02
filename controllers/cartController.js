
const User = require('../models/userModel');
const Cart = require('../models/cartItem');
const paintingProduct = require('../models/paintingProductModel');

const cart = async(req,res)=>{
  
    try {
        const uniqueID = req.session.uniqueID;
        // console.log('Received uniqueID:', uniqueID);
        const userData = await User.findById(req.session.user_id);
        const cartItems = await Cart.find({uniqueID}).populate('product');
        
        if (!userData) {
            res.render('cart', { user: '',cartItems }); // Pass user as ''
          }
          else if(!cartItems){
              res.render('cart', { user: userData,cartItems: '' }); // Pass user as ''
          }
           else {
            res.render('cart', { user: userData,cartItems }); // Pass user data if available
          }
        
        
    } catch (error) {
        console.log(error.message);
    }

}
// router.get('/add/:id', function(req, res, next) {
    const addCart = async (req, res) => {
        const uniqueID = req.session.uniqueID;
        // console.log("uniqueID -"+uniqueID)
        const productId = req.params.id;
    
        const cartItem = await Cart.findOne({ uniqueID, product: productId });
        try {
            if(cartItem){
                // If the product is in the cart, increase the quantity
                cartItem.quantity += 1;
                const quantityInteger = parseInt(cartItem.quantity, 10);
                const productName = cartItem.product;
                const productPrice = await paintingProduct.findOne({_id:productName});
                const priceString = productPrice.price;
                const priceInteger = parseInt(priceString, 10);

                cartItem.totalPrice =priceInteger*quantityInteger;
                console.log(cartItem.totalPrice);
                await cartItem.save();
                res.redirect('/painting');
            }
            else {
                // If the product is not in the cart, create a new cart item
                // const productName = cartItem.product;
                const productPrice = await paintingProduct.findOne({_id:productId});
                // Assuming productPrice.price is a string representation of a number
const priceString = productPrice.price;
const priceInteger = parseInt(priceString, 10); // The second parameter (10) is the radix or base, typically set to 10 for decimal

                const totalPrice =priceInteger*1;
                console.log('first product'+totalPrice);
                const newCartItem = new Cart({ product: productId, quantity: 1, uniqueID,totalPrice:totalPrice});
                await newCartItem.save();
                res.redirect('/painting');
            }

        } catch (error) {
            console.error('Error adding product to cart:', error);
            res.status(500).json({ error: 'Failed to add product to the cart' });
        }
      };

    const removeCart = async (req, res) => {
        const uniqueID = req.session.uniqueID;
        const productId = req.params.id;
        const cartItem = await Cart.findOne({ uniqueID, product: productId });
        // const userId = req.user ? req.user.id : null; // Get the user's ID if authenticated
      
        if (cartItem) {
            // If the product is in the cart, decrement the quantity
            if (cartItem.quantity > 1) {
                cartItem.quantity -= 1;
                const quantityInteger = parseInt(cartItem.quantity, 10);
                const productName = cartItem.product;
                const productPrice = await paintingProduct.findOne({_id:productName});
                const priceString = productPrice.price;
                const priceInteger = parseInt(priceString, 10);

                cartItem.totalPrice =priceInteger*quantityInteger;
                
                await cartItem.save();
                res.redirect('/cart');
            } else {
                // If the quantity is 1, remove the entire cart item
                await cartItem.remove();
                res.redirect('/cart');
            }
        }

};






module.exports = {
    cart,
    addCart,
    removeCart
};
