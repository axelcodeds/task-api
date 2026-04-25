const express = require("express");
const router = express.Router();
const taskController = require("../controllers/tasks");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware, taskController.getAll);
router.post("/", authMiddleware, taskController.create);
router.get("/:id", authMiddleware, taskController.getById);
router.put("/:id", authMiddleware, taskController.update);
router.delete("/:id", authMiddleware, taskController.delete);

module.exports = router;
