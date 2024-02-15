const express = require("express");
const router = express.Router();
const sequelize = require("../sequelize");
const { assessment } = sequelize.models;

// Define your routes here
router.get("/:assessmentId", async (req, res) => {
  const query = await assessment.findByPk(req.params.assessmentId);
  const assessmentGroups = await query.getUploaderGroups();
  const assessmentUploaders = await query.getUploaders();
  console.log(query);
  console.log(assessmentGroups);
  console.log(assessmentUploaders);
  res.json({ success: "get call succeed!", url: req.url });
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
