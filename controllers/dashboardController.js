import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import Cart from "../models/cartModel.js";
import Visit from "../models/visitModel.js";

export const getDashboardOverview = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Basic stats
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const activeCarts = await Cart.countDocuments({ status: "active" });

    const paidOrders = await Order.find({ isPaid: true });
    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalPrice, 0);

    const todayOrders = await Order.find({
      isPaid: true,
      createdAt: { $gte: today },
    });
    const todaySales = todayOrders.reduce((sum, o) => sum + o.totalPrice, 0);

    // Visits
    const totalVisits = await Visit.countDocuments();
    const todayVisits = await Visit.countDocuments({
      createdAt: { $gte: today },
    });

    // Recent Orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email");

    // Newest Users
    const newUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email role");

    // Low Stock
    const lowStock = await Product.find({ countInStock: { $lte: 5 } })
      .limit(5)
      .select("name image countInStock");

    // Best Sellers
    const bestSellers = await Order.aggregate([
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.product",
          name: { $first: "$orderItems.name" },
          image: { $first: "$orderItems.image" },
          totalQty: { $sum: "$orderItems.qty" },
          totalRevenue: {
            $sum: {
              $multiply: ["$orderItems.qty", "$orderItems.price"],
            },
          },
        },
      },
      { $sort: { totalQty: -1 } },
      { $limit: 5 },
    ]);

    // Sales chart
    const salesChart = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          total: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Orders per week
    const ordersChart = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 28)),
          },
        },
      },
      {
        $group: {
          _id: { $week: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      stats: {
        totalUsers,
        totalOrders,
        totalRevenue,
        activeCarts,
        todaySales,
        totalVisits,
        todayVisits,
      },

      salesChart: salesChart.map((i) => ({
        date: i._id,
        value: i.total,
      })),

      ordersChart: ordersChart.map((i) => ({
        week: i._id,
        count: i.count,
      })),

      recentOrders: recentOrders.map((o) => ({
        _id: o._id,
        customerName: o.user?.name,
        date: o.createdAt,
        total: o.totalPrice,
        status: o.status,
      })),

      bestSellers: bestSellers.map((p) => ({
        _id: p._id,
        name: p.name,
        image: p.image,
        sales: p.totalQty,
        revenue: p.totalRevenue,
      })),

      lowStock: lowStock.map((p) => ({
        _id: p._id,
        name: p.name,
        image: p.image,
        stock: p.countInStock,
      })),

      newUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load dashboard data" });
  }
};

