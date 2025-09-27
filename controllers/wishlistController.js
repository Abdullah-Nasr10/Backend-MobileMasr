const Wishlist = require("../models/wishlistModel");




//===========Get-Wishlist-by-User=================
exports.getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.params.userId })
            .populate("products")
            .populate("user", "name email");

        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" });
        }

        res.json(wishlist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


//===========add-To-Wishlist=================
exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        let wishlist = await Wishlist.findOne({ user: req.params.userId });

        if (!wishlist) {
            wishlist = new Wishlist({ user: req.params.userId, products: [] });
        }

        if (!wishlist.products.includes(productId)) {
            wishlist.products.push(productId);
        }

        await wishlist.save();
        res.status(201).json(wishlist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


//===========remove-From-Wishlist=================
exports.removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        let wishlist = await Wishlist.findOne({ user: req.params.userId });

        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" });
        }

        wishlist.products = wishlist.products.filter(
            (p) => p.toString() !== productId
        );

        await wishlist.save();
        res.json(wishlist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==============Delete-Wishlist=================
exports.deleteWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOneAndDelete({ user: req.params.userId });

        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" });
        }

        res.json({ message: "Wishlist deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};