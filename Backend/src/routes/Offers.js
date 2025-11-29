const { Flights } = require("../models/Flights");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await Flights.find({ "offer.isActive": true });
    res.send(response);
  } catch (e) {
    res.status(500).send("Error Fetching Offers");
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const id = req.params.id.trim();
    console.log(id);

    const coll = mongoose.connection.db.collection("flights");
    const flight = await coll.findOne({ _id: id });

    console.log(flight);
    if (!flight) {
      return res.status(404).send("No Flight Found With That ID");
    }

    // Prepare update
    const update = {
      $set: {
        "offer.isActive": true,
        "offer.oldPrice": flight.price,
        "offer.newPrice": parseInt(req.body.newPrice),
        "offer.badge": "Hot Offer",
        "offer.expiresAt": req.body.expiresAt,
      },
    };

    const updated = await coll.findOneAndUpdate({ _id: id }, update, {
      returnDocument: "after",
    });

    return res.status(200).send(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error Making This Flight An Offer");
  }
});

module.exports = router;
