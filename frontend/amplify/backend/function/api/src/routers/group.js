const express = require("express");
const router = express.Router();
const sequelize = require("../sequelize");
const { uploaderGroup } = sequelize.models;

// Define your routes here
router.get("/:groupId", async (req, res) => {
  const group = await uploaderGroup.findByPk(req.params.groupId);
  const groupMembers = await group.getUploaders();
  group.dataValues.users = groupMembers;
  res.json({ success: "get call succeed!", data: group });
});

router.post("/", (req, res) => {
  res.json({ success: "post call succeed!", url: req.url, body: req.body });
});

router.put("/:groupId", (req, res) => {
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

router.delete("/:groupId", (req, res) => {
  res.json({ success: "delete call succeed!", url: req.url });
});

// Export the router
module.exports = router;
