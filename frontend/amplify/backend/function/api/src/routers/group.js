import express from "express";
const router = express.Router();

// Define your routes here
router.get("/:groupId", (req, res) => {
  res.json({ success: "get call succeed!", url: req.url });
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
export default router;
