const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// Create Cart Automatically or Add Product
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user._id; // protect middleware
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: userId });

    // Create cart automatically if not exist
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({
        product: productId,
        quantity: quantity || 1,
        price: product.price,
      });
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId })
      .populate("items.product", "name price images")
      .populate("user", "name email");

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Product Quantity
exports.updateQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (!item) return res.status(404).json({ message: "Product not found in cart" });

    item.quantity = quantity;
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove Product from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear Cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
