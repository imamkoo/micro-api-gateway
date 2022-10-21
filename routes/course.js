const express = require("express");
const router = express.Router();

const coursesHandler = require("./handler/courses");

const verifyToken = require("../middlewares/verifyToken");
const permission = require("../middlewares/permission");

router.get("/", coursesHandler.getAll);
router.get("/:id", coursesHandler.get);

router.post("/", verifyToken, permission("admin"), coursesHandler.create);
router.put("/:id", verifyToken, permission("admin"), coursesHandler.update);
router.delete("/:id", verifyToken, permission("admin"), coursesHandler.destroy);

module.exports = router;
