const express = require("express");
const profileController = require("../controllers/profile.controller");
const { validateUsername } = require("../validators/profile.validator");

const router = express.Router();

router.post("/analyze/:username", validateUsername, profileController.analyzeProfile);
router.get("/", profileController.getAllProfiles);
router.get("/:username", validateUsername, profileController.getProfileByUsername);

module.exports = router;
