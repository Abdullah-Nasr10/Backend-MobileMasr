const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");

//  Create a new order from a cart
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user._id; // Get user from token (protect middleware)

    const {
      phone,
      fullName,
      governorate,
      city,
      street,
      notes,
      paymentMethod // "cod" or "online"
    } = req.body;

    // Find user's cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    // Create order items snapshot (preserve prices at checkout time)
    const items = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.price // priceAfterDiscount from cart
    }));

    const subtotal = cart.totalPrice;
    const shippingFees = 100; // Fixed shipping fee (or make it dynamic)
    const totalAmount = subtotal + shippingFees;

    const newOrder = new Order({
      user: userId,
      shippingAddress: {
        fullName,
        phone,
        governorate,
        city,
        street,
        notes,
      },
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
      items,
      subtotal,
      shippingFees,
      totalAmount,
      orderStatus: "pending",
    });

    await newOrder.save();

    // Clear cart after order creation
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
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
    const { orderStatus, paymentStatus } = req.body;

    // Prepare update object
    const updateData = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    // Update the order's status and return the updated document
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
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
