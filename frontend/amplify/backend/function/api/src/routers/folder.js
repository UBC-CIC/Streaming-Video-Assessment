const express = require("express");
const router = express.Router();

// Define your routes here
router.get("/:folderId", (req, res) => {
  res.json({ success: "get call succeed!", url: req.url });
});

router.post("/", (req, res) => {
  res.json({ success: "post call succeed!", url: req.url, body: req.body });
});

router.put("/:folderId", (req, res) => {
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

router.delete("/:folderId", (req, res) => {
  res.json({ success: "delete call succeed!", url: req.url });
});

// Export the router
module.exports = router;
