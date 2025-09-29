const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            minlength: [3, "Name must be at least 3 characters"],
            maxlength: [50, "Name must be less than 50 characters"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false,
        },
        phone: {
            type: String,
            match: [/^01[0-9]{9}$/, "Phone must be a valid Egyptian number"],
        },
        address: {
            type: String,
            maxlength: 200,
        },
        role: {
            type: String,
            enum: ["customer", "admin"],
            default: "customer",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        passwordResetToken: String,
        passwordResetExpires: Date,
    },
    { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT
userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
};

// Password reset
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

// Virtual profile
userSchema.virtual("profile").get(function () {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        phone: this.phone,
        role: this.role,
    };
});

module.exports = mongoose.model("User", userSchema);

