const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Vendor name is required"], trim: true },
    phone: {
        type: String,
        match: [/^01[0-2,5]{1}[0-9]{8}$/, "Please provide a valid Egyptian phone number"]
    },
    address: { type: String },
    image: { type: String, required: [true, "Vendor image is required"] },
    rating: { type: Number, default: 0, min: 0, max: 5 },
},
    { timestamps: true }
);

module.exports = mongoose.model("Vendor", VendorSchema);