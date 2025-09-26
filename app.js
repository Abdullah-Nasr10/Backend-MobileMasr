const express = require("express");
const app = express();
const mongoose = require("mongoose");


mongoose.connect("mongodb+srv://abdullahnasr1022_db_user:IQS5XWKylJVL3Ghc@productioncluster.lcsqmf0.mongodb.net/EcommerceMobileStore")
    .then(() => console.log("mongoDB Atlas Connected"))
    .catch((err) => console.log(err))

app.listen(3000, () => {
    console.log("Database Server Connected");

})