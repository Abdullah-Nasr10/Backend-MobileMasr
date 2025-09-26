const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Vendor name is required"], trim: true },
    email: {
        type: String,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"]
    },
    phone: {
        type: String,
        match: [/^01[0-2,5]{1}[0-9]{8}$/, "Please provide a valid Egyptian phone number"]
    },
    address: { type: String },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Vendor", VendorSchema);
