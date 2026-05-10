import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto"
import getTransporter from "../config/mailer.js"

// 🔑 Generate Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// 📝 Register
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
    });

    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔓 Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// 🔑 Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    console.log("Forgot password request for:", req.body.email)
    console.log("EMAIL_USER:", process.env.EMAIL_USER)
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "loaded" : "MISSING")

    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "No account found with this email" })
    }

    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetExpiry = Date.now() + 60 * 60 * 1000

    user.resetPasswordToken = resetToken
    user.resetPasswordExpiry = resetExpiry
    await user.save()

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

    try {
      const transporter = getTransporter()
      await transporter.sendMail({
        from: `"ElderCare+" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Reset your ElderCare+ password",
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #0f766e;">ElderCare+</h2>
            <p>Hi ${user.name},</p>
            <p>You requested to reset your password. Click the button below:</p>
            <a href="${resetUrl}"
              style="display: inline-block; background: #0f766e; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">
              Reset Password
            </a>
            <p style="color: #888; font-size: 13px;">This link expires in 1 hour.</p>
            <p style="color: #888; font-size: 13px;">If you did not request this, ignore this email.</p>
          </div>
        `,
      })
      console.log("Email sent successfully")
    } catch (emailError) {
      console.error("Email sending failed:", emailError.message)
      return res.status(500).json({ error: emailError.message })
    }

    res.json({ message: "Password reset email sent" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// 🔒 Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params
    const { password } = req.body

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset link" })
    }

    user.password = await bcrypt.hash(password, 10)
    user.resetPasswordToken = undefined
    user.resetPasswordExpiry = undefined
    await user.save()

    res.json({ message: "Password reset successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}