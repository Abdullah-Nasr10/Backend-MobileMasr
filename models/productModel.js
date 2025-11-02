const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Product name is required"], trim: true },
    price: { type: Number, required: [true, "Price is required"], min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    skuCode: { type: String, unique: true, required: true },
    description: { type: String, maxlength: 1000 },
    condition: { type: String, enum: ["new", "used"], default: "new" },
    storage: { type: String },
    ram: [{ type: String }],
    color: { type: String },
    batteryCapacity: { type: String },
    simCard: { type: String },
    screenSize: { type: String },
    camera: { type: String },
    weight: { type: String },
    accessories: [{ type: String }],
    batteryStatus: { type: String }, // لو مستعمل
    guarantee: { type: String },
    images: [{ type: String }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
    date: { type: Date, default: Date.now }
}, {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual property to calculate priceAfterDiscount automatically
ProductSchema.virtual('priceAfterDiscount').get(function () {
    return this.price - (this.price * this.discount / 100);
});

module.exports = mongoose.model("Product", ProductSchema);
