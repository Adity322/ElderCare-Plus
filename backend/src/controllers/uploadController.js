import Caregiver from "../models/Caregiver.js"

export const uploadDocuments = async (req, res) => {
  try {
    const caregiver = await Caregiver.findOne({ userId: req.user._id })
    if (!caregiver) {
      return res.status(404).json({ message: "Caregiver profile not found" })
    }
    const fileUrls = req.files.map((file) => file.path)
    caregiver.documents.push(...fileUrls)
    await caregiver.save()
    res.json({
      message: "Documents uploaded",
      documents: caregiver.documents,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
