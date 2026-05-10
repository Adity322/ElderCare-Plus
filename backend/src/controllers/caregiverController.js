import Caregiver from "../models/Caregiver.js";


// ➕ Create Caregiver Profile
export const createCaregiverProfile = async (req, res) => {
  try {
    // check existing profile
    const existingProfile = await Caregiver.findOne({
      userId: req.user._id,
    });

    if (existingProfile) {
      return res
        .status(400)
        .json({ message: "Profile already exists" });
    }

    const caregiver = await Caregiver.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json(caregiver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// 📥 Get Verified Caregivers
export const getCaregivers = async (req, res) => {
  try {
    const caregivers = await Caregiver.find({
      isVerified: true,
    }).populate("userId", "name email phone");

    res.json(caregivers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// 🔍 Get Single Caregiver
export const getSingleCaregiver = async (req, res) => {
  try {
    const caregiver = await Caregiver.findById(req.params.id)
      .populate("userId", "name email phone");

    if (!caregiver) {
      return res.status(404).json({
        message: "Caregiver not found",
      });
    }

    res.json(caregiver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ✏️ Update Caregiver Profile
export const updateCaregiver = async (req, res) => {
  try {
    const caregiver = await Caregiver.findOneAndUpdate(
      { userId: req.user._id },
      req.body,
      { new: true }
    );

    res.json(caregiver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ✅ Admin Verify Caregiver
export const verifyCaregiver = async (req, res) => {
  try {
    const caregiver = await Caregiver.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );

    res.json({
      message: "Caregiver verified",
      caregiver,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// 📅 Update Availability
export const updateAvailability = async (req, res) => {
  try {
    const caregiver = await Caregiver.findOneAndUpdate(
      { userId: req.user._id },
      {
        availability: req.body.availability,
      },
      { new: true }
    );

    res.json(caregiver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};