import express from "express";
import { queryDatabase } from "../db.js";
const router = express.Router();

// Define your routes here
router.get("/:folderId", async (req, res) => {
  try {
    const query = await queryDatabase(`SELECT * FROM test`);
    res.json({ success: "get call succeed!", url: req.url, data: query });
  } catch (error) {
    console.log("GET call failed: ", error);
  }
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
export default router;
