const { OAuth2Client } = require("google-auth-library");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// =============== Google Login ===============
const googleLogin = async (req, res) => {
  try {
    const { token } = req.body; // token from client side
    if (!token)
      return res.status(400).json({ message: "Google token is required" });

    //بجيب البيانات من جوجل
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // find user by email OR by googleId
    let user = await User.findOne({ $or: [{ email }, { googleId }] }).select(
      "+password"
    );

    if (!user) {
      // create new user (no password)
      user = await User.create({
        name,
        email,
        googleId,
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    // generate site JWT
    const authToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Google login successful",
      token: authToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture,
      },
    });
  } catch (err) {
    console.error("googleLogin error:", err);
    return res
      .status(400)
      .json({ message: "Invalid Google token", error: err.message });
  }
};

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

// =============== login User ===============
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // if user signed up via Google only (no password)
    if (!user.password) return res.status(400).json({message:"This account is registered with Google. Please login with Google.",});

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = user.generateAuthToken(user._id);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        message: "Uers Login",
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ===================Get profile===================
const getProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ==================Update profile======================
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email, phone, address } = req.body;

    if (email && email !== user.email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken)
        return res.status(400).json({ message: "Email already in use" });
      user.email = email;
    }
    if (phone && phone !== user.phone) {
      const phoneTaken = await User.findOne({ phone });
      if (phoneTaken)
        return res.status(400).json({ message: "Phone already in use" });
      user.phone = phone;
    }

    user.name = name || user.name;
    user.address = address || user.address;

    await user.save();
    res.json({
      message: "Profile updated",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =============== Change password (logged in) ===============
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      return res.status(400).json({ message: "Old and new password required" });

    const user = await User.findById(req.user._id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch)
      return res.status(401).json({ message: "Old password incorrect" });

    user.password = newPassword;
    await user.save();
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  googleLogin,
};
