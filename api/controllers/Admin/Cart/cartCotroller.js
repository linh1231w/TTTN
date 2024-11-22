const Cart = require("../../../models/Cart/Cart");
const CartItem = require("../../../models/Cart/CartItem");
const Product = require("../../../models/Product/Product");
const Image = require("../../../models/Product/ProductImage");


exports.addToCart = async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const userId = req.user ? req.user.id : null;
      const sessionId = req.session.id;
  
      let cart = await Cart.findOne({ 
        where: userId ? { userId } : { sessionId } 
      });
  
      if (!cart) {
        cart = await Cart.create({ userId, sessionId });
      }
  
      let cartItem = await CartItem.findOne({
        where: { cartId: cart.id, productId }
      });
  
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      const price = product.salePrice || product.price;
  
      if (cartItem) {
        cartItem.quantity += quantity;
        cartItem.price = price;
        await cartItem.save();
      } else {
        cartItem = await CartItem.create({
          cartId: cart.id,
          productId,
          quantity,
          price
        });
      }
  
      res.status(200).json({ message: 'Item added to cart', cartItem });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.updateCartItem = async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const userId = req.user ? req.user.id : null;
      const sessionId = req.session.id;
  
      const cart = await Cart.findOne({ 
        where: userId ? { userId } : { sessionId } 
      });
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      const cartItem = await CartItem.findOne({
        where: { id, cartId: cart.id }
      });
  
      if (!cartItem) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
  
      cartItem.quantity = quantity;
      await cartItem.save();
  
      res.status(200).json({ message: 'Cart item updated', cartItem });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.removeFromCart = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user ? req.user.id : null;
      const sessionId = req.session.id;
  
      const cart = await Cart.findOne({ 
        where: userId ? { userId } : { sessionId } 
      });
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      const cartItem = await CartItem.findOne({
        where: { id, cartId: cart.id }
      });
  
      if (!cartItem) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
  
      await cartItem.destroy();
  
      res.status(200).json({ message: 'Item removed from cart' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.getCart = async (req, res) => {
    try {
      const userId = req.user ? req.user.id : null;
      const sessionId = req.session.id;
  
      const cart = await Cart.findOne({
        where: userId ? { userId } : { sessionId },
        include: [{
          model: CartItem,
          include: [{
            model: Product,
            include: [{
              model: Image,
              as: 'images',
              attributes: ['url','isMain','uid']
            }]
          }]
        }]
      });
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.syncCart = async (req, res) => {
    try {
      const userId = req.user.id;
      const productIdQuantity = req.body;

      let userCart = await Cart.findOne({ where: { userId } });

      if (!userCart) {
        userCart = await Cart.create({ userId });
      }

      // Update existing cart items or add new ones
      for (const item of productIdQuantity) {
        const [cartItem, created] = await CartItem.findOrCreate({
          where: { cartId: userCart.id, productId: item.productId },
          defaults: { quantity: item.quantity }
        });

        if (!created) {
          // If the item already exists, update its quantity by adding the new quantity
          await cartItem.update({ quantity: cartItem.quantity + item.quantity });
        }
      }

      res.status(200).json({ message: 'Cart synchronized successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
