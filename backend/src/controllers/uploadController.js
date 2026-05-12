import Caregiver from "../models/Caregiver.js"
import cloudinary from "../config/cloudinary.js"

export const uploadDocuments = async (req, res) => {
  try {
    const caregiver = await Caregiver.findOne({ userId: req.user._id })
    if (!caregiver) {
      return res.status(404).json({ message: "Caregiver profile not found" })
    }

    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const isPdf = file.mimetype === "application/pdf"
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "eldercare-caregivers",
            resource_type: isPdf ? "raw" : "image",
            format: isPdf ? "pdf" : undefined,
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result.secure_url)
          }
        )
        uploadStream.end(file.buffer)
      })
    })

    const fileUrls = await Promise.all(uploadPromises)
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
