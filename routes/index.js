const express = require("express");
const router = express.Router();
const controller = require("../controllers/index");

const userController = controller.userController;

router.post("/register", userController.register);
// router.post("/login", userController.login);
router.post("/sleep", userController.addSleepData);
router.get("/sleep", userController.getSleepData);

module.exports = router;
