const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");

//  Create a new order from a cart
exports.createOrder = async (req, res) => {
  try {
    const { cartId, userId } = req.body;

    // Check if the cart exists
    const cart = await Cart.findById(cartId).populate("items.product");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Create a new order based on the cart
    const newOrder = new Order({
      cart: cart._id,
      user: userId || cart.user, // use userId from request or from cart
      totalAmount: cart.totalPrice,
      status: "pending"
    });

    await newOrder.save();

    // Optionally link the order to the cart
    cart.order = newOrder._id;
    await cart.save();

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

//  Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    // Populate related cart and user data
    const orders = await Order.find()
      .populate("cart")
      .populate("user", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Get a single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("cart")
      .populate("user", "name email");

    // If no order found
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Update the order's status and return the updated document
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    // Delete order by ID
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
