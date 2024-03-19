const express = require("express");
const router = express.Router();
const sequelize = require("../sequelize");
const { uploaderGroup, uploader, folder } = sequelize.models;

router.get("/", async (req, res) => {
  let folderId = req.query["folderId"];
  let query = null;
  if (!folderId) {
    query = await folder.findOne({
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
  } else {
    query = await folder.findOne({
      where: { id: folderId },
      include: [
        {
          association: "owner",
          where: {
            email: req["userEmail"],
          },
        },
      ],
    });
  }

  if (!query) {
    res.status(404).json({ error: "Folder not found" });
    return;
  }

  const content = await query
    .getContents()
    .then((results) => {
      const contents = results.map((result) => {
        if (result.status === "fulfilled") {
          return result.value;
        }
      });
      return contents;
    })
    .then((mappedContents) => mappedContents.flat())
    .then((contents) =>
      contents.filter((content) => content.type != "assessment"),
    );

  const path = await query.getFolderPath();

  res.json({ success: "get call succeed!", data: { content, path } });
});

// Define your routes here
router.get("/:groupId", async (req, res) => {
  const group = await uploaderGroup.findByPk(req.params.groupId);
  const groupMembers = await group.getUploaders();
  group.dataValues.users = groupMembers;
  res.json({ success: "get call succeed!", data: group });
});

router.post("/", async (req, res) => {
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

  if (!group) {
    res.status(404).json({ error: "Group not found" });
    return;
  }

  // update group name
  await group.update({
    name: req.body.name,
    folderId: req.body.folderId,
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
      const newUser = await uploader.findOrCreate({
        where: { email: user.email },
        defaults: { name: user.name },
      });
      const addUser = !(await group.hasUploader(newUser[0]));
      if (addUser) {
        await group.addUploader(newUser[0]);
      }
    }),
  );

  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

router.delete("/:groupId", (req, res) => {
  res.json({ success: "delete call succeed!", url: req.url });
});

// Export the router
module.exports = router;
