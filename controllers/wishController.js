
const User = require('../models/userModel');
const Wish = require('../models/wishItem'); // Import your cart model
const paintingProduct = require('../models/paintingProductModel');
const wish = async(req,res)=>{
  
    try {
        const uniqueID = req.session.uniqueID;
        const userData = await User.findById(req.session.user_id);
 
        const wishItems = await Wish.find({uniqueID}).populate('product');
        
        if (!userData) {
            res.render('wishlist', { user: '',wishItems }); // Pass user as ''
          }
          else if(!wishItems){
              res.render('wishlist', { user: userData,wishItems: '' }); // Pass user as ''
          }
           else {
            res.render('wishlist', { user: userData,wishItems }); // Pass user data if available
          }
        
        
    } catch (error) {
        console.log(error.message);
    }

}
// router.get('/add/:id', function(req, res, next) {
    const addWish = async (req, res) => {
        const uniqueID = req.session.uniqueID;
        // console.log("uniqueID -"+uniqueID)
        const productId = req.params.id;
    
        const wishItem = await Wish.findOne({ uniqueID, product: productId });
      
        try {
            if(wishItem){
                  // If the product is in the cart, increase the quantity
                  wishItem.quantity += 1;
                  const quantityInteger = parseInt(wishItem.quantity, 10);
                  const productName = wishItem.product;
                  const productPrice = await paintingProduct.findOne({_id:productName});
                  const priceString = productPrice.price;
                  const priceInteger = parseInt(priceString, 10);
  
                  wishItem.totalPrice =priceInteger*quantityInteger;
                  console.log(wishItem.totalPrice);
                await wishItem.save();
                res.redirect('/painting');
            }
            else {
                const productPrice = await paintingProduct.findOne({_id:productId});
                const priceString = productPrice.price;
                const priceInteger = parseInt(priceString, 10);
                const totalPrice =priceInteger*1;

                const newWishItem = new Wish({ product: productId, quantity: 1, uniqueID,totalPrice:totalPrice });
                await newWishItem.save();
                res.redirect('/painting');
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
            res.status(500).json({ error: 'Failed to add product to the cart' });
        }
      };


    const removeWish = async (req, res) => {
        const uniqueID = req.session.uniqueID;
        const productId = req.params.id;
        const wishItem = await Wish.findOne({ uniqueID, product: productId });
        // const userId = req.user ? req.user.id : null; // Get the user's ID if authenticated

        try {
            if (wishItem) {
                // If the product is in the cart, decrement the quantity
                if (wishItem.quantity > 1) {
                    wishItem.quantity -= 1;

                    const quantityInteger = parseInt(wishItem.quantity, 10);
                    const productName = wishItem.product;
                    const productPrice = await paintingProduct.findOne({_id:productName});
                    const priceString = productPrice.price;
                    const priceInteger = parseInt(priceString, 10);
    
                    wishItem.totalPrice =priceInteger*quantityInteger;    
                    
                    await wishItem.save();
                    
                    res.redirect('/wishlist');
                } else {
                    // If the quantity is 1, remove the entire cart item
                    await wishItem.remove();
                    res.redirect('/wishlist');
                }
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
            res.status(500).json({ error: 'Failed to add product to the cart' });
        }
};






module.exports = {
    wish,
    addWish,
    removeWish
};
