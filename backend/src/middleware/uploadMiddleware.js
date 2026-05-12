import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import cloudinary from "../config/cloudinary.js"

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const isPdf = file.mimetype === "application/pdf"
    return {
      folder: "eldercare-caregivers",
      allowed_formats: ["jpg", "png", "jpeg", "pdf"],
      resource_type: isPdf ? "raw" : "image",
      format: isPdf ? "pdf" : undefined,
    }
  },
})

const upload = multer({ storage })

export default upload
