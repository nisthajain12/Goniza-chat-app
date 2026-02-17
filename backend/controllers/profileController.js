const Profile = require("../models/Profile");

exports.saveProfile = async (req, res) => {

  try {

    console.log("USER ID:", req.userId);
    console.log("BODY:", req.body);

    const profile = await Profile.create({
      userId: req.userId,
      ...req.body,
      isComplete: true
    });


    res.status(201).json({
      message: "Profile saved successfully",
      profile
    });

  } catch (error) {
    console.error("SAVE ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};
exports.getProfile = async (req, res) => {
  try {

    const profile = await Profile.findOne({ userId: req.userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({
      profile,
      profileComplete: profile.isComplete
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: req.userId },
      {
        ...req.body,
        isComplete: true
      },
      { new: true }
    );

    res.status(200).json({
      profile: updatedProfile,
      profileComplete: updatedProfile.isComplete
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.searchProfiles = async (req, res) => {
  try {

    const searchQuery = req.query.query;

    const profiles = await Profile.find({
      name: { $regex: searchQuery, $options: "i" }
    }).select("name photo userId");

    res.status(200).json(profiles);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

