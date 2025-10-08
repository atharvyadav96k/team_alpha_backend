const express = require("express");
const router = express.Router();
const Dustbin = require("../modules/Dustbin");

// Get all dustbins
router.get("/", async (req, res) => {
  try {
    const bins = await Dustbin.find();
    res.json(bins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single dustbin by ID
router.get("/:id", async (req, res) => {
  try {
    const bin = await Dustbin.findById(req.params.id);
    if (!bin) return res.status(404).json({ message: "Dustbin not found" });
    res.json(bin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new dustbin
router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const data = await Dustbin.findOne({
      name: req.body.name
    });
    if(data){
      return res.status(301).send("already registered");
    }
    const dustbin = new Dustbin(req.body);
    await dustbin.save();
    res.status(201).json(dustbin);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update bin level and location (from hardware)
router.post("/update/:name", async (req, res) => {
  const { location, bins, points } = req.body;
  try {
    console.log(req.body);
    console.log(req.params.name);
    const dustbin = await Dustbin.findOne({name: req.params.name});
    console.log(dustbin);
    if (!dustbin) return res.status(404).json({ message: "Dustbin not found" });

    if (location) {
      dustbin.location = location;
    }
    if (bins) {
      dustbin.bins = bins;
    }
    if (points) {
      dustbin.points += points;
    }

    dustbin.lastUpdated = Date.now();
    await dustbin.save();

    res.json({ message: "Dustbin updated successfully", dustbin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add points only
router.post("/points/:id", async (req, res) => {
  const { points } = req.body;

  if (typeof points !== "number") {
    return res.status(400).json({ message: "Points must be a number" });
  }

  try {
    const dustbin = await Dustbin.findById(req.params.id);
    if (!dustbin) return res.status(404).json({ message: "Dustbin not found" });

    dustbin.points += points;
    dustbin.lastUpdated = Date.now();

    await dustbin.save();

    res.json({ message: "Points updated successfully", totalPoints: dustbin.points });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
