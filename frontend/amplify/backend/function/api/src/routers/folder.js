const express = require("express");
const router = express.Router();
const sequelize = require("../sequelize");
const { folder } = sequelize.models;

// Define your routes here
router.get("/:folderId", async (req, res) => {
  try {
    // TODO: Implement get, must get all children folders and files
    const query = await folder.findByPk(req.params.folderId);
    query.dataValues.path = await query.getFolderPath();
    query.dataValues.files = await query
      .getContents()
      .then((results) => {
        const contents = results.map((result) => {
          if (result.status === "fulfilled") {
            return result.value;
          }
        });
        return contents;
      })
      .then((mappedContents) => mappedContents.flat());
    res.json({ success: "get call succeed!", data: query });
  } catch (error) {
    console.log("GET call failed: ", error);
    res.status(500).json({ error: "GET call failed", error: error });
  }
});

router.post("/move", async (req, res) => {
  try {
    // These sequelize models must have the "move" method
    const file = {
      folder,
      assessment: sequelize.models.assessment,
      group: sequelize.models.uploaderGroup,
    }[req.body.file.type];

    const newFolderId = req.body.newFolderId;

    // TODO: insure ownership
    const toMove = await file.findByPk(req.body.file.id);

    const updatedFile = await toMove.move(newFolderId);
    res.json({ success: "post call succeed!", data: updatedFile });
  } catch (e) {
    console.log("POST call failed: ", e);
    res.status(500).json({ error: "POST call failed", error: e });
  }
});

router.post("/", async (req, res) => {
  try {
    const folderObj = {
      name: req.body.name,
      ownerId: req.body.ownerId,
      parentId: req.body.parentId,
    };
    const newFolder = await folder.create(folderObj);
    res.json({ success: "post call succeed!", data: newFolder });
  } catch (e) {
    console.log("POST call failed: ", e);
    res.status(500).json({ error: "POST call failed", error: e });
  }
});

router.patch("/:folderId", async (req, res) => {
  try {
    const updatedFolder = await folder.update(req.body, {
      where: { id: req.params.folderId },
    });
    res.json({ success: "patch call succeed!", data: updatedFolder });
  } catch (e) {
    console.log("PUT call failed: ", e);
    res.status(500).json({ error: "PUT call failed", error: e });
  }
});

router.delete("/:folderId", (req, res) => {
  // TODO: Implement delete, must delete all children folders and files
  res.json({ success: "delete call succeed!", url: req.url });
});

// Export the router
module.exports = router;
