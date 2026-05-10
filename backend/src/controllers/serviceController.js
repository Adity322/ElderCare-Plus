import Service from "../models/Service.js"

// 📥 Get all active services (public)
export const getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true })
    res.json(services)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// 📥 Get all services including inactive (admin)
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find()
    res.json(services)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// ➕ Create service (admin)
export const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body)
    res.status(201).json(service)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// ✏️ Update service (admin)
export const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    if (!service) {
      return res.status(404).json({ message: "Service not found" })
    }
    res.json(service)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// 🗑️ Deactivate service (admin)
export const deactivateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    )
    if (!service) {
      return res.status(404).json({ message: "Service not found" })
    }
    res.json({ message: "Service deactivated", service })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}