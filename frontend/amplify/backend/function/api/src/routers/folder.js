const express = require("express");
const router = express.Router();
const sequelizePromise = require("../sequelize");

const folderRouterPromise = new Promise((resolve, reject) => {
  sequelizePromise.then((sequelize) => {
    const { folder, user } = sequelize.models;
  
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
  
        return res.json({ rootId: user1.folders[0].id });
      }
      return res.json({ rootId: query.id });
    });
  
    router.get("/:folderId", async (req, res) => {
      try {
        const query = await folder.findByPk(req.params.folderId, {
          include: [
            {
              association: "owner",
            },
          ],
        });
  
        if (!query || query.owner.email !== req["userEmail"]) {
          return res.status(403).json({ error: "Forbidden" });
        }
  
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
  
        if (
          !toMove ||
          (await toMove.getOwner()).email !== req["userEmail"] ||
          !(await folder.isOwnedBy(parseInt(newFolderId), req["userEmail"]))
        ) {
          return res.status(403).json({ error: "Forbidden" });
        }
  
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
  
      if (!parent || parent.owner.email !== req["userEmail"]) {
        return res.status(403).json({ error: "Forbidden" });
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
          include: [
            {
              association: "owner",
              where: {
                email: req["userEmail"], // This should ensure ownership
              },
            },
          ],
        });
        res.json({ success: "patch call succeed!", data: updatedFolder });
      } catch (e) {
        console.log("PUT call failed: ", e);
        res.status(500).json({ error: "PUT call failed", error: e });
      }
    });
  
    router.delete("/:folderId", async (req, res) => {
      const query = await folder.findByPk(req.params.folderId, {
        include: [
          {
            association: "owner",
          },
        ],
      });
  
      if (!query || query.owner.email !== req["userEmail"]) {
        return res.status(403).json({ error: "Forbidden" });
      }
  
      await query.destroy();
  
      res.json({ success: "delete call succeed!", url: req.url });
    });
  
    resolve(router)
  }).catch((err) => {
    console.log(err)
    reject(err)
  })
})
// Export the router
module.exports = folderRouterPromise;