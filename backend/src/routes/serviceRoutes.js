import express from "express"
import {
  getServices,
  getAllServices,
  createService,
  updateService,
  deactivateService,
} from "../controllers/serviceController.js"
import { protect } from "../middleware/authMiddleware.js"
import { authorizeRoles } from "../middleware/roleMiddleware.js"

const router = express.Router()

// Public
router.get("/", getServices)

// Admin only
router.get("/all", protect, authorizeRoles("admin"), getAllServices)
router.post("/", protect, authorizeRoles("admin"), createService)
router.put("/:id", protect, authorizeRoles("admin"), updateService)
router.put("/:id/deactivate", protect, authorizeRoles("admin"), deactivateService)

export default router