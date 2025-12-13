import Product from "../models/productModel.js";

// ========== Create Product ==========
export const createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// ========== Get All Products ==========
export const getProducts = async (req, res) => {

    try {
        const pageParam = req.query.page;
        // Base query with populates
        const baseQuery = Product.find()
            .populate("category")
            .populate("brand")
            .populate("vendor");

        // simple page size
        const pageSize = 15;
        const totalItems = await Product.countDocuments();
        const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize);

        let products;
        // If page is not provided, return all products
        if (typeof pageParam === 'undefined') {
            products = await baseQuery;
            return res.status(200).json({ success: true, data: products, totalPages });
        }

        const page = Math.max(1, parseInt(pageParam) || 1);
        products = await baseQuery.limit(pageSize).skip((page - 1) * pageSize);

        res.status(200).json({ success: true, data: products, totalPages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ========== Get Single Product ==========
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate("category")
            .populate("brand")
            .populate("vendor");

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ========== Update Product ==========
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// ========== Delete Product ==========
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
