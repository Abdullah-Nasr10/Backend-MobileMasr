const Review = require("../models/reviewModel");
const Product = require("../models/productModel");

// add new rev
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { id: productId } = req.params;

    const existingReview = await Review.findOne({
      product: productId,
      user: req.user.id,
    });

    if (existingReview) {
      return res.status(400).json({ message: "You already reviewed this product" });
    }

    const review = new Review({
      user: req.user.id,
      product: productId,
      rating,
      comment,
    });

    await review.save();

    // update avg rating for product
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      numReviews: reviews.length,
      rating: avgRating.toFixed(1),
    });

    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get rev for product
exports.getReviews = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const reviews = await Review.find({ product: productId }).populate("user", "name email");
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// del rev only admin 
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);

    if (!review) return res.status(404).json({ message: "Review not found" });

    // ال هيمسح الريفيو بس الادمن او صاحب الريفيو
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await review.deleteOne();

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



