const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const config = require("config");
const express = require("express");
const cors=require("cors");
const path=require("path");
const flightRouter=require("./routes/Flights");
const offersRouter=require("./routes/Offers");
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const port = 3500;
mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://mazenhaytham:xme5Ig4Ke3cnkALZ@cluster-1.khjoctg.mongodb.net/test?appName=Cluster-1"
  )
  .then(() => {
    console.log("Connected To DB");
  })
  .catch(() => {
    console.error("Couldn't Connect To DB");
  });
app.use("/flights",flightRouter);
app.use("/offers",offersRouter);
app.listen(port, () => {
  console.log(`Connected On The Server On Port ${port} `);
});
