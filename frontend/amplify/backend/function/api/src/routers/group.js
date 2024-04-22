const express = require("express");
const router = express.Router();
const sequelize = require("../sequelize");
const { uploaderGroup, uploader, folder } = sequelize.models;

router.get("/", async (req, res) => {
  let folderId = req.query["folderId"];
  const query = await folder.findOne({
    where: folderId ? { id: folderId } : { parentId: null },
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
    res.status(404).json({ error: "Folder not found" });
    return;
  }

  const content = await query
    .getContents()
    .then((results) => {
      return results.flat();
    })
    .then((contents) =>
      contents.filter((content) => content.type != "assessment"),
    );

  const path = await query.getFolderPath();

  res.json({ success: "get call succeed!", data: { content, path } });
});

// Define your routes here
router.get("/:groupId", async (req, res) => {
  const group = await uploaderGroup.findByPk(req.params.groupId);

  if (!group || (await group.getOwner()).email !== req["userEmail"]) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const groupMembers = await group.getUploaders();
  group.dataValues.users = groupMembers;
  res.json({ success: "get call succeed!", data: group });
});

router.post("/", async (req, res) => {
  if (!(await folder.isOwnedBy(req.body.folderId, req["userEmail"]))) {
    return res.status(403).json({ error: "Forbidden" });
  }

  // Create a group
  const newGroup = await uploaderGroup.create({
    name: req.body.name,
    folderId: req.body.folderId,
  });

  // Create and add users to the group
  const promises = req.body.users.map((user) => {
    return uploader.findOrCreate({
      where: { email: user.email },
      defaults: { name: user.name },
    });
  });

  const users = await Promise.all(promises).then((users) => {
    return users.map((user) => user[0]);
  });

  await newGroup.addUploaders(users);

  res.json({ success: "post call succeed!", url: req.url, body: newGroup });
});

router.put("/:groupId", async (req, res) => {
  const group = await uploaderGroup.findByPk(req.params.groupId, {
    include: [uploader],
  });

  if (!group || (await group.getOwner()).email !== req["userEmail"]) {
    return res.status(403).json({ error: "Forbidden" });
  }

  // update group name
  await group.update({
    name: req.body.name,
  });

  // remove uploaders
  await Promise.all(
    group.uploaders.map(async (user) => {
      const removeUser = !req.body.users.find((u) => u.email === user.email);
      if (removeUser) await group.removeUploader(user);
    }),
  );

  // add new uploaders
  await Promise.all(
    req.body.users.map(async (user) => {
      const [newUser, created] = await uploader.findOrCreate({
        where: { email: user.email },
        defaults: { name: user.name },
      });
      const addUser = !(await group.hasUploader(newUser));
      if (addUser) {
        await group.addUploader(newUser);
      }
    }),
  );

  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

router.delete("/:groupId", async (req, res) => {
  const group = await uploaderGroup.findByPk(req.params.groupId, {
    include: [uploader],
  });

  if (!group || (await group.getOwner()).email !== req["userEmail"]) {
    return res.status(403).json({ error: "Forbidden" });
  }

  await group.destroy();

  res.json({ success: "delete call succeed!", url: req.url });
});

// Export the router
module.exports = router;
