const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

//  Add product to cart (create cart automatically if not exist)
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user._id; // from protect middleware
    const { productId, quantity } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // Find user cart
    let cart = await Cart.findOne({ user: userId });

    // Create new cart if not found
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if product already exists in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      // Increment quantity if already exists
      existingItem.quantity += quantity || 1;
    } else {
      // Add new product to cart
      cart.items.push({
        product: productId,
        quantity: quantity || 1,
        price: product.price,
      });
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: error.message });
  }
};

//  Get user's cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId })
      .populate("items.product")
      .populate("user", "name email")
      .populate("order"); // populate order if exists

    if (!cart)
      return res.status(404).json({ message: "Cart not found" });

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({ message: error.message });
  }
};

//  Update product quantity in cart
exports.updateQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (!item)
      return res
        .status(404)
        .json({ message: "Product not found in cart" });

    // Update quantity
    item.quantity = quantity;
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error updating quantity:", error);
    res.status(500).json({ message: error.message });
  }
};

//  Remove a product from cart
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Remove product
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: error.message });
  }
};

//  Clear all products from cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: error.message });
  }
};
