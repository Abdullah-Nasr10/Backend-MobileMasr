require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors")
const PORT = process.env.PORT;

//========import-swagger========
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");





// ================Import-Routes====================
const productRoutes = require("./routes/productRoute");
const brandRoutes = require("./routes/brandRoute");
const wishlistRoute = require("./routes/wishlistRoute");
const vendorRoutes = require("./routes/vendorRoute");












// ================connectDB=================
const { connectDB } = require("./config/connectDB");
connectDB();


//==============Middleware===============
app.use(express.json());
app.use(cors())






// =============Routes====================
app.use("/products", productRoutes);
app.use("/brands", brandRoutes);
app.use("/wishlist", wishlistRoute);
app.use("/vendors", vendorRoutes);












// =======swagger-setup========
const swaggerOptions = swaggerJsDoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Final Project swagger API",
            version: "1.0.0",
        },
        servers: [{
            url: process.env.swaggerURL
        }],

    },
    apis: ["./app.js", "./routes/*.js"]
})


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOptions));









mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
mongoose.connection.on("error", (err) => {
    console.log(err);
});


