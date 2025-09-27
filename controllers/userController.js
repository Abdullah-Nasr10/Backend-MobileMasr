const User = require("../models/userModel");

// =============== Register User ===============
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // 1  Validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, Email and Password are required" });
    }

    // 2 Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 3 Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
    });

    // 4 Generate token
    const token = user.generateAuthToken();

    // 5 Send response
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: user.profile,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { registerUser };
