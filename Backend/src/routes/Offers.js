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

router.patch("/:id",async(req,res)=>{
  const id=req.params.id.trim();
  const flight=await Flights.findById(id);
  if(!flight){
    return res.status(404).send("No Flight With That Id")
  }
  if(!("newPrice" in req.body) || !("expiresAt" in req.body)){
    return res.status(400).send("You Must Enter A New Price and Expiration Date");
  }
  const oldPrice=flight.price;
  const newPrice=parseInt(req.body.newPrice);
  const expiresAt=new Date(req.body.expiresAt);
  if(oldPrice<newPrice){
    return res.status(400).send("The New Price Is Greater Than The Old Price");
  }
  const todayDate=new Date();
  todayDate.setHours(0,0,0,0);
  if(expiresAt<todayDate){
    return res.status(400).send("The Expiration Date Must Be Greater Than or Equal Today's Date ");
  }
  const offer={
    isActive:true,
    oldPrice:oldPrice,
    newPrice:newPrice,
    badge:"Hot Offer",
    expiresAt:expiresAt
  }
  flight.offer=offer;
  try{
    const newFlightOffer=await Flights.findByIdAndUpdate(id,flight,{new:true});
    return res.status(200).send(`The Offer Is Applied On Flight With ID : ${id}`);
  }catch(error){
    console.error(error);
    return res.status(500).send("Error Adding Offer On The Flight");
  }
})

module.exports = router;
