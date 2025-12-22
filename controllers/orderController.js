import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

// =================Create a new order from a cart==========================
export const createOrder = async (req, res) => {
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

    // Check if stock is sufficient for all items
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product: ${item.product.name?.en || item.product.name}`,
          product: item.product.name,
          availableStock: item.product.stock,
          requestedQuantity: item.quantity
        });
      }
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

    // Update stock and sale for each product
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        {
          $inc: {
            stock: -item.quantity,  // Decrease stock
            sale: item.quantity      // Increase sale
          }
        }
      );
    }

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

//  =========================Get all orders (Admin only)==========================
export const getAllOrdersAdmin = async (req, res) => {
  try {
    const lang = req.query.lang || "en";

    const orders = await Order.find()
      .populate("items.product")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    // Localize orders
    const localizedOrders = orders.map(order => ({
      ...order.toObject(),
      items: order.items.map(item => ({
        product: item.product ? {
          _id: item.product._id,
          name: item.product.name?.[lang] || item.product.name?.en,
          images: item.product.images,
          price: item.product.price
        } : null,
        quantity: item.quantity,
        price: item.price,
        _id: item._id
      }))
    }));

    res.json(localizedOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  =========================Get all orders for logged-in user==========================
export const getAllOrdersForUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const lang = req.query.lang || "en";

    const orders = await Order.find({ user: userId })
      .populate("items.product")
      .sort({ createdAt: -1 });

    // Localize orders
    const localizedOrders = orders.map(order => ({
      ...order.toObject(),
      items: order.items.map(item => ({
        product: item.product ? {
          _id: item.product._id,
          name: item.product.name?.[lang] || item.product.name?.en,
          images: item.product.images,
          price: item.product.price
        } : null,
        quantity: item.quantity,
        price: item.price,
        _id: item._id
      }))
    }));

    res.json(localizedOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  =========================Get a single order by ID==========================
export const getOrderById = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role; // Get user role
    const lang = req.query.lang || "en";

    console.log("Fetching order ID:", req.params.id, "| User ID:", userId, "| User Role:", userRole);

    // Allow admin to view any order, or user to view their own order
    const query = userRole === "admin" 
      ? { _id: req.params.id }
      : { _id: req.params.id, user: userId };

    const order = await Order.findOne(query).populate("items.product");

    console.log("Query used:", query, "| Order found:", !!order);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Localize order
    const localizedOrder = {
      ...order.toObject(),
      items: order.items.map(item => ({
        product: item.product ? {
          _id: item.product._id,
          name: item.product.name?.[lang] || item.product.name?.en,
          images: item.product.images,
          price: item.product.price
        } : null,
        quantity: item.quantity,
        price: item.price,
        _id: item._id
      }))
    };

    res.json(localizedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  =========================Update order status==========================
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    // Get the current order first
    const currentOrder = await Order.findById(req.params.id);
    if (!currentOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // If changing to canceled and wasn't canceled before, restore stock and sale
    if (
      orderStatus === "canceled" &&
      currentOrder.orderStatus !== "canceled"
    ) {
      for (const item of currentOrder.items) {
        const product = await Product.findById(item.product);
        if (product) {
          await Product.findByIdAndUpdate(
            item.product,
            {
              $inc: {
                stock: item.quantity,
                sale: product.sale >= item.quantity ? -item.quantity : -product.sale
              }
            }
          );
        }
      }
    }

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

    res.json({ message: "Order updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  =========================Delete an order==========================
export const deleteOrder = async (req, res) => {
  try {
    // Find order before deletion to restore stock and sale
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Restore stock and sale for each product
    for (const item of order.items) {
      const product = await Product.findById(item.product);

      if (product) {
        await Product.findByIdAndUpdate(
          item.product,
          {
            $inc: {
              stock: item.quantity,   // Restore stock
              sale: product.sale >= item.quantity ? -item.quantity : -product.sale    // Decrease sale but not below 0
            }
          }
        );
      }
    }

    // Delete order
    await Order.findByIdAndDelete(req.params.id);

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};