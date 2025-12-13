import Wishlist from "../models/wishlistModel.js";

// =======================================
//            GET WISHLIST
// =======================================
export const getWishlist = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;

        const wishlist = await Wishlist.findOne({ user: userId })
            .populate({
                path: "products",
                populate: {
                    path: "vendor",
                    select: "name _id"
                }
            })
            .populate("user", "name email");

        if (!wishlist) {
            return res.json({ products: [] });
        }

        res.json(wishlist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// =======================================
//            ADD TO WISHLIST
// =======================================
export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user._id || req.user.id;

        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            wishlist = new Wishlist({ user: userId, products: [] });
        }

        // لو المنتج موجود بالفعل
        if (wishlist.products.includes(productId)) {
            await wishlist.populate({
                path: "products",
                populate: { path: "vendor", select: "name _id" }
            });
            return res.json({ status: "exists", products: wishlist.products });
        }

        wishlist.products.push(productId);
        await wishlist.save();

        // populate للمنتجات مع الـ vendor
        await wishlist.populate({
            path: "products",
            populate: { path: "vendor", select: "name _id" }
        });

        res.json({ status: "added", products: wishlist.products });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// =======================================
//         REMOVE FROM WISHLIST
// =======================================
export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user._id || req.user.id;

        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            return res.status(404).json({ status: "not_found" });
        }

        wishlist.products = wishlist.products.filter(
            (p) => p.toString() !== productId
        );

        await wishlist.save();
        
        await wishlist.populate({
            path: "products",
            populate: { path: "vendor", select: "name _id" }
        });

        res.json({ status: "removed", products: wishlist.products });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// =======================================
//         DELETE ALL WISHLIST
// =======================================
export const deleteWishlist = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;

        await Wishlist.findOneAndDelete({ user: userId });

        res.json({ status: "cleared" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
