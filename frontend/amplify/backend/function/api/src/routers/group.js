const express = require("express");
const router = express.Router();
const sequelize = require("../sequelize");
const { uploaderGroup, uploader } = sequelize.models;

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
  const promises = req.body.users.map(async (user) => {
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

router.put("/:groupId", (req, res) => {
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

router.delete("/:groupId", (req, res) => {
  res.json({ success: "delete call succeed!", url: req.url });
});

// Export the router
module.exports = router;
