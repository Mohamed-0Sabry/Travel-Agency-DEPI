const { Flights, handleFlightValidation } = require("../models/FlightsModified");
const express = require("express");
const router = express.Router();
const upload = require("./uploader");

router.get("/", async (req, res) => {
  try {
    const flights = await Flights.find();
    res.send(flights);
  } catch (e) {
    console.err(e);
    res.status(500).send("Error Fetching Flights");
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const flight = await Flights.findById(id);
  if (!flight) {
    res.status(404).send("No Flight Found With That Id");
  }
  res.send(flight);
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
    res.status(201).send(newFlight);
  } catch (e) {
    console.err(e);
    res.status(500).send("Error Occured While Saving The Flight");
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  const flight = await Flights.findById(req.params.id);
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
    image: req.file ? req.file.path : flight.image,
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
  let updatedFlight = new Flights(payload);
  try {
    const update = await Flights.findByIdAndUpdate(
      req.params.id,
      updatedFlight,
      { new: true }
    );
    res.status(200).send(update);
  } catch (e) {
    res.status(500).send("Error Updating Flight Info");
  }
});

router.delete("/:id", async (req, res) => {
  const flight = await Flights.findById(req.params.id);
  if (!flight) {
    return res.status(404).send("No Flight Found With That Id");
  }
  try {
    const deleted = await Flights.findByIdAndDelete(req.params.id);
    res.status(200).send("The Flight Is Deleted Successfully");
  } catch (e) {
    res.status(500).send("Error Deleting The Flight");
  }
});
module.exports = router;
