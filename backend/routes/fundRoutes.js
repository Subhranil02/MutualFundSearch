const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const SavedFund = require("../models/SavedFund");

// ✅ POST /api/funds/save
router.post("/save", fetchuser, async (req, res) => {
  const { schemeCode, schemeName, fundHouse, schemeType } = req.body;
  try {
    const newFund = new SavedFund({
      userId: req.user.id,
      schemeCode,
      schemeName,
      fundHouse,
      schemeType,
    });
    await newFund.save();
    res.status(201).json({ message: "Fund saved successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// ✅ ADD THIS: GET /api/funds/saved
router.get("/saved", fetchuser, async (req, res) => {
  try {
    const savedFunds = await SavedFund.find({ userId: req.user.id });
    res.status(200).json(savedFunds);
  } catch (error) {
    console.error("Error fetching saved funds:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:schemeCode", fetchuser, async (req, res) => {
  try {
    const deleted = await SavedFund.findOneAndDelete({
      userId: req.user.id,
      schemeCode: req.params.schemeCode,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Fund not found" });
    }

    res.status(200).json({ message: "Fund deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
