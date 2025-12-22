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

    const paidOrders = await Order.find({ paymentStatus: "paid" });
    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    const todayOrders = await Order.find({
      paymentStatus: "paid",
      createdAt: { $gte: today },
    });
    const todaySales = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);

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
      .select("name email role profilePicture");

    // Low Stock
    const lowStock = await Product.find({ stock: { $lt: 2, $gt: 0 } })
      .limit(5)
      .select("name images stock");

    // Out of Stock
    const outOfStock = await Product.find({ stock: 0 })
      .limit(5)
      .select("name images stock");

    // Best Sellers - derive from paid orders items and enrich from products
    let bestSellers = await Order.aggregate([
      {
        $match: {
          $or: [
            { paymentStatus: "paid" },
            { paymentMethod: "cod", orderStatus: { $in: ["confirmed", "processing", "shipped", "delivered"] } }
          ]
        }
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalQty: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.quantity", "$items.price"] },
          },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: { path: "$product", preserveNullAndEmptyArrays: true },
      },
      {
        $addFields: {
          name: { $ifNull: ["$product.name.en", "$product.name.ar"] },
          images: "$product.images",
          image: { $arrayElemAt: ["$product.images", 0] },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          image: 1,
          images: 1,
          totalQty: 1,
          totalRevenue: 1,
        },
      },
      { $sort: { totalQty: -1 } },
      { $limit: 5 },
    ]);

      // Replace placeholder images with first product image if available
      bestSellers = bestSellers.map(item => {
        const isPlaceholder = typeof item.image === 'string' && item.image.includes('via.placeholder.com');
        const firstProductImage = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : null;
        
        if (isPlaceholder && firstProductImage) {
          return { ...item, image: firstProductImage };
        }
        return item;
      });

    // Sales chart - Get last 30 days of orders (paid or not, to have data)
    const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));
    const salesChart = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: thirtyDaysAgo,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          total: { $sum: "$totalAmount" },
          count: { $sum: 1 }
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
        value: i.total || 0,
      })),

      ordersChart: ordersChart.map((i) => ({
        week: i._id,
        count: i.count,
      })),

      recentOrders: recentOrders.map((o) => ({
        _id: o._id,
        customerName: o.user?.name || o.shippingAddress?.fullName,
        date: o.createdAt,
        total: o.totalAmount,
        status: o.orderStatus.charAt(0).toUpperCase() + o.orderStatus.slice(1),
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
        name: p.name.en || p.name,
        image: p.images && p.images.length > 0 ? p.images[0] : null,
        stock: p.stock,
      })),

      outOfStock: outOfStock.map((p) => ({
        _id: p._id,
        name: p.name.en || p.name,
        image: p.images && p.images.length > 0 ? p.images[0] : null,
        stock: p.stock,
      })),

      newUsers: newUsers.map((u) => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        profilePicture: u.profilePicture,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load dashboard data" });
  }
};

