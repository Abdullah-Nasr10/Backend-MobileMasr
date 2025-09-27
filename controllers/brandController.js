const Brand = require("../models/brandModel");
// const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ message: "Error fetching brands", error });
  }
};

const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ message: "Error fetching brand", error });
  }
};

const createBrand = async (req, res) => {
  try {
    const { name, img } = req.body;

    if (!name || !img) {
      return res.status(400).json({ message: "Name and image are required" });
    }

    const brandExists = await Brand.findOne({ name });
    if (brandExists) {
      return res.status(400).json({ message: "Brand already exists" });
    }

    const brand = new Brand({ name, img });
    const savedBrand = await brand.save();

    res.status(201).json(savedBrand);
  } catch (error) {
    res.status(500).json({ message: "Error creating brand", error });
  }
};

const updateBrand = async (req, res) => {
  try {
    const { name, img } = req.body;

    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    brand.name = name || brand.name;
    brand.img = img || brand.img;

    const updatedBrand = await brand.save();
    res.status(200).json(updatedBrand);
  } catch (error) {
    res.status(500).json({ message: "Error updating brand", error });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    await brand.deleteOne();
    res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting brand", error });
  }
};

module.exports = {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
};
