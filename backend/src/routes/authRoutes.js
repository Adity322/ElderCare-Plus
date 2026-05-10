import express from "express"
import { register, login, forgotPassword, resetPassword } from "../controllers/authController.js"
import { protect } from "../middleware/authMiddleware.js"
import { authorizeRoles } from "../middleware/roleMiddleware.js"
import User from "../models/User.js"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:token", resetPassword)
router.post("/logout", protect, (req, res) => {
  res.json({ message: "Logged out successfully" })
})
router.get(
  "/users",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const users = await User.find().select("-password")
      res.json(users)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default router