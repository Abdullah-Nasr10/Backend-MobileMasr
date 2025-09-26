import mongoose from "mongoose";

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
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
