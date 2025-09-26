const mongoose = require("mongoose");

const WarrantySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["Local", "International", "30-days"],
        required: true
    },
    duration: {
        type: String,
        required: [true, "Warranty duration is required"] // مثال: "12 Months"
    },
    details: {
        type: String,
        maxlength: 300
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Warranty", WarrantySchema);
