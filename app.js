require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT;
const { connectDB } = require("./config/connectDB");
connectDB();


const brandRoute = require("./routes/brandRoute");
const wishlistRoute = require("./routes/wishlistRoute");

app.use(express.json());

// ------------------------------ mos-Brand-------------------------//

app.use("/api/brands", brandRoute);

// ------------------------------ mos-Wishlist-------------------------//

app.use("/api/wishlist", wishlistRoute);


mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`Servsr running on port ${PORT}`);
    });
});
mongoose.connection.on("error", (err) => {
    console.log(err);
});




mongoose.connect("mongodb+srv://abdullahnasr1022_db_user:IQS5XWKylJVL3Ghc@productioncluster.lcsqmf0.mongodb.net/EcommerceMobileStore")
    .then(() => console.log("mongoDB Atlas Connected"))
    .catch((err) => console.log(err))

app.listen(3000, () => {
    console.log("Database Server Connected");

})
