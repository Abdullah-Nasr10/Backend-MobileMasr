const Vendor = require("../models/vendorModel");

exports.createVendor = async (req, res) => {
  try {
    const vendor = new Vendor(req.body);
    await vendor.save();
    res.status(201).json({ message: "Vendor created successfully", vendor });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.status(200).json(vendors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ error: "Vendor not found" });
    res.status(200).json(vendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!vendor) return res.status(404).json({ error: "Vendor not found" });
    res.status(200).json({ message: "Vendor updated successfully", vendor });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) return res.status(404).json({ error: "Vendor not found" });
    res.status(200).json({ message: "Vendor deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
