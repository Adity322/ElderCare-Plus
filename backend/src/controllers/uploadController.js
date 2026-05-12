import Caregiver from "../models/Caregiver.js"
import supabase from "../config/supabase.js"

export const uploadDocuments = async (req, res) => {
  try {
    const caregiver = await Caregiver.findOne({ userId: req.user._id })
    if (!caregiver) {
      return res.status(404).json({ message: "Caregiver profile not found" })
    }

    const uploadPromises = req.files.map(async (file) => {
      const fileName = `${Date.now()}-${file.originalname}`
      const { data, error } = await supabase.storage
        .from("eldercare-uploads")
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        })

      if (error) throw error

      const { data: urlData } = supabase.storage
        .from("eldercare-uploads")
        .getPublicUrl(fileName)

      return urlData.publicUrl
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
