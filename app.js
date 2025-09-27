require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT;
const productRoutes = require("./routes/productRoute");


const { connectDB } = require("./config/connectDB");
connectDB();


app.use("/products", productRoutes);








mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`Servsr running on port ${PORT}`);
    });
});
mongoose.connection.on("error", (err) => {
    console.log(err);
});


