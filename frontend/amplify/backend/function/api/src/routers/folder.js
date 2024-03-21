const express = require("express");
const router = express.Router();
const sequelize = require("../sequelize");
const { folder, user } = sequelize.models;

// Define your routes here
router.get("/home", async (req, res) => {
  const query = await folder.findOne({
    where: { parentId: null },
    include: [
      {
        association: "owner",
        where: {
          email: req["userEmail"],
        },
      },
    ],
  });
  if (!query) {
    const user1 = await user.create(
      {
        email: req["userEmail"],
        isPlatformManager: false,
        isAssessmentCreator: true,
        folders: [
          // Create root folder along with user
          {
            name: "Home",
          },
        ],
      },
      {
        include: [user.folders],
      },
    );
    console.log({ user1 });

    return res.json({ rootId: user1.folders[0].id });
  }
  return res.json({ rootId: query.id });
});

router.get("/:folderId", async (req, res) => {
  try {
    const query = await folder.findByPk(req.params.folderId);
    query.dataValues.path = await query.getFolderPath();
    query.dataValues.files = await query.getContents().then((results) => {
      return results.flat();
    });
    res.json({ success: "get call succeed!", data: query });
  } catch (error) {
    console.log("GET call failed: ", error);
    res.status(500).json({ error: "GET call failed", error: error });
  }
});

router.put("/move", async (req, res) => {
  try {
    // These sequelize models must have the "move" method
    const file = {
      folder,
      assessment: sequelize.models.assessment,
      group: sequelize.models.uploaderGroup,
    }[req.body.file.type];

    const newFolderId = req.body.newFolderId;

    // TODO: ensure ownership
    const toMove = await file.findByPk(req.body.file.id);

    const updatedFile = await toMove.move(newFolderId);
    res.json({ success: "put call succeed!", data: updatedFile });
  } catch (e) {
    console.log("PUT call failed: ", e);
    res.status(500).json({ error: "PUT call failed", error: e });
  }
});

router.post("/", async (req, res) => {
  const parent = await folder.findByPk(req.body.parentId, {
    include: [
      {
        association: "owner",
      },
    ],
  });

  if (!parent) {
    return res.status(404).json({ error: "Folder not found" });
  }

  if (parent.owner.email !== req["userEmail"]) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const folderObj = {
      name: req.body.name,
      ownerId: parent.owner.id,
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
