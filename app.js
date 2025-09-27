require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT;
const productRoutes = require("./routes/productRoute");
const brandRoutes = require("./routes/brandRoute");


const { connectDB } = require("./config/connectDB");
connectDB();


// Middleware
app.use(express.json());


app.use("/products", productRoutes);
app.use("/brands", brandRoutes);








mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`Servsr running on port ${PORT}`);
    });
});
mongoose.connection.on("error", (err) => {
    console.log(err);
});


