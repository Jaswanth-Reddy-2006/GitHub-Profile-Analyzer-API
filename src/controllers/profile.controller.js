const profileService = require("../services/profile.service");

async function analyzeProfile(req, res, next) {
  try {
    const { username } = req.params;
    const profile = await profileService.analyzeAndStoreProfile(username);

    res.status(201).json({
      success: true,
      message: "GitHub profile analyzed and stored successfully",
      data: profile
    });
  } catch (error) {
    next(error);
  }
}

async function getAllProfiles(req, res, next) {
  try {
    const profiles = await profileService.getAllProfiles();

    res.json({
      success: true,
      count: profiles.length,
      data: profiles
    });
  } catch (error) {
    next(error);
  }
}

async function getProfileByUsername(req, res, next) {
  try {
    const { username } = req.params;
    const profile = await profileService.getProfileByUsername(username);

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  analyzeProfile,
  getAllProfiles,
  getProfileByUsername
};
