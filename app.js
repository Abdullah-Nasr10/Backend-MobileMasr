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
const userRoute = require("./routes/userRoute");
const adminRoutes = require("./routes/adminRoute");
const categoryRoutes = require("./routes/categoryRoute");
const cartRoutes = require("./routes/cartRoute");
const orderRoutes = require("./routes/orderRoute");
const reviewRoutes = require("./routes/reviewRoute");











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
app.use("/auth", userRoute);
app.use("/admin", adminRoutes);
app.use("/categories", categoryRoutes);
app.use("/cart", cartRoutes);
app.use("/orders",orderRoutes );
app.use("/api", reviewRoutes);










// =======swagger-setup========
const swaggerOptions = swaggerJsDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Final Project swagger API",
      version: "1.0.0",
      description: "API documentation for Final Project",
    },
    servers: [
      {
        url: process.env.swaggerURL,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./app.js", "./routes/*.js"],
});



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


