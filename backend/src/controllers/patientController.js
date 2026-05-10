import Patient from "../models/Patient.js";

// ➕ Create Patient
export const createPatient = async (req, res) => {
  try {
    const patient = await Patient.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📥 Get All Patients (for logged-in user)
export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find({ userId: req.user._id });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update Patient
export const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );

    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ❌ Delete Patient
export const deletePatient = async (req, res) => {
  try {
    await Patient.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    res.json({ message: "Patient deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};