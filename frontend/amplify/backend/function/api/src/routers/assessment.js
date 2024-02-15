const express = require("express");
const router = express.Router();
const sequelize = require("../sequelize");
const { assessment } = sequelize.models;

// Define your routes here
router.get("/:assessmentId", async (req, res) => {
  const query = await assessment.findByPk(req.params.assessmentId);
  query.dataValues.submissions = await query.getSubmissions();
  res.json({ success: "get call succeed!", data: query });
});

router.post("/", (req, res) => {
  res.json({ success: "post call succeed!", url: req.url, body: req.body });
});

router.put("/:assessmentId", (req, res) => {
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

router.delete("/:assessmentId", (req, res) => {
  res.json({ success: "delete call succeed!", url: req.url });
});

// Export the router
module.exports = router;
