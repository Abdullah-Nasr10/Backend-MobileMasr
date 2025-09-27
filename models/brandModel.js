const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Brand name is required"],
            unique: true,
            trim: true,
        },
        image: {
            type: String,
            required: [true, "Brand image is required"],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Brand", BrandSchema);
