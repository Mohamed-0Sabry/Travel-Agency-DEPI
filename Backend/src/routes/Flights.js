const { Flights, handleFlightValidation } = require("../models/FlightsModified");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const upload = require("./uploader");

router.get("/", async (req, res) => {
  try {
    const flights = await Flights.find();
    return res.send(flights);
  } catch (e) {
    console.err(e);
    return res.status(500).send("Error Fetching Flights");
  }
});


router.get("/debug/:id", async (req, res) => {
  const id = req.params.id.trim();
  try {
    const dbName = mongoose.connection && mongoose.connection.name;
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) return res.status(400).send({ error: "Invalid ObjectId" });
    const objId = new mongoose.Types.ObjectId(id);
    const coll = mongoose.connection.db.collection("flights");
    const rawByObjectId = await coll.findOne({ _id: objId });
    // try matching by string _id in case documents store _id as string
    const rawByStringId = await coll.findOne({ _id: id });
    const byModel = await Flights.findById(id);
    const total = await coll.countDocuments();
    // get a breakdown of _id types in the collection
    const idTypes = await coll
      .aggregate([
        { $project: { _idType: { $type: "$_id" } } },
        { $group: { _id: "$ _idType", count: { $sum: 1 } } },
      ])
      .toArray()
      .catch(() => []);

    return res.send({
      dbName,
      totalDocuments: total,
      idTypes,
      rawByObjectIdExists: !!rawByObjectId,
      rawByObjectId: rawByObjectId,
      rawByStringIdExists: !!rawByStringId,
      rawByStringId: rawByStringId,
      byModelExists: !!byModel,
      byModel,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id.trim();
    console.log("Looking for ID:", id);
    
    // Direct query using the raw collection
    const coll = mongoose.connection.db.collection("flights");
    const flight = await coll.findOne({ _id: id });
    
    console.log("Flight found:", flight);
    
    if (!flight) {
      return res.status(404).send("No Flight Found With That Id");
    }
    
    return res.send(flight);
  } catch (e) {
    console.error("Error:", e);
    return res.status(500).send("Error fetching flight: " + e.message);
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("Flight Image Is Not Sent");
  }
  const payload = {
    price: req.body["price"],
    origin: {
      city: req.body["origin.city"],
      country: req.body["origin.country"],
    },
    destination: {
      city: req.body["destination.city"],
      country: req.body["destination.country"],
    },
    image: req.file.filename,
    offer: {
      isActive: req.body["offer.isActive"] === "true",
      oldPrice: req.body["offer.oldPrice"],
      newPrice: req.body["offer.newPrice"],
      badge: req.body["offer.badge"],
      expiresAt: req.body["offer.expiresAt"],
    },
    description: req.body["description"],
    rating: req.body["rating"],
  };

  const { error } = handleFlightValidation(payload);
  if (error) {
    const errorMessages = error.details.map((err) => err.message);
    return res.status(400).send(errorMessages);
  }
  let flight = new Flights(payload);
  try {
    const newFlight = await flight.save();
    return res.status(201).send(newFlight);
  } catch (e) {
    console.err(e);
    return res.status(500).send("Error Occured While Saving The Flight");
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const id = req.params.id.trim();
    
    // Check if flight exists using raw collection
    const coll = mongoose.connection.db.collection("flights");
    const flight = await coll.findOne({ _id: id });
    
    if (!flight) {
      return res.status(404).send("No Flight Found With That Id");
    }
    
    const payload = {
      price: req.body.price,
      origin: {
        city: req.body["origin.city"],
        country: req.body["origin.country"],
      },
      destination: {
        city: req.body["destination.city"],
        country: req.body["destination.country"],
      },
      image: req.file ? req.file.filename : flight.image,
      offer: {
        isActive: req.body["offer.isActive"] === "true",
        oldPrice: req.body["offer.oldPrice"],
        newPrice: req.body["offer.newPrice"],
        badge: req.body["offer.badge"],
        expiresAt: req.body["offer.expiresAt"],
      },
      description: req.body.description,
      rating: req.body.rating,
    };
    
    const { error } = handleFlightValidation(payload);
    if (error) {
      const errorMessages = error.details.map((err) => err.message);
      return res.status(400).send(errorMessages);
    }
    
    // Update using raw collection
    const update = await coll.findOneAndUpdate(
      { _id: id },
      { $set: payload },
      { returnDocument: 'after' }
    );
    
    return res.status(200).send(update);
  } catch (e) {
    console.error(e);
    return res.status(500).send("Error Updating Flight Info");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id.trim();
    
    const coll = mongoose.connection.db.collection("flights");
    const flight = await coll.findOne({ _id: id });
    
    if (!flight) {
      return res.status(404).send("No Flight Found With That Id");
    }
    
    await coll.deleteOne({ _id: id });
    return res.status(200).send("The Flight Is Deleted Successfully");
  } catch (e) {
    console.error(e);
    return res.status(500).send("Error Deleting The Flight");
  }
});
module.exports = router;
