import User from "../models/userModel.js";
// ========================GET /admin/users=========================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ count: users.length, users });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//================== GET /admin/users/:id======================
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ==========================PUT /admin/users/:id=============================
const updateUserByAdmin = async (req, res) => {
  try {
    const { name, email, role, phone, address, isActive } = req.body;

    const user = await User.findById(req.params.id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // عشان اتاكد ان الاميل مش متسجل ل حد تانى 
    if (email && email !== user.email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) return res.status(400).json({ message: "Email already in use" });
      user.email = email;
    }
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (typeof isActive === "boolean") user.isActive = isActive;

    await user.save();
    const out = await User.findById(user._id).select("-password");
    res.json({ message: "User updated", user: out });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//===========================DELETE /admin/users/:id?===============

const deleteUserByAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // منع الأدمن من حذف نفسه
    if (req.user._id.equals(user._id)) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    const hard = req.query.hard === "true";
    if (hard) {
      await User.deleteOne({ _id: user._id });
      return res.json({ message: "User permanently deleted" });
    } else {
      user.isActive = false;
      await user.save();
      return res.json({ message: "User deactivated (soft delete)" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



export {
  getAllUsers,
  getUserById,
  updateUserByAdmin,
  deleteUserByAdmin,
};
