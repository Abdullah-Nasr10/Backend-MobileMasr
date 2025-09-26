const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    rating: {
        type: Number,
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating cannot be more than 5"],
        required: true
    },
    comment: {
        type: String,
        maxlength: 500
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Review", ReviewSchema);
