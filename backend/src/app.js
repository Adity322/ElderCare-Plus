import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import caregiverRoutes from "./routes/caregiverRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import careRoutes from "./routes/careRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js"
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/caregivers",caregiverRoutes);
app.use("/api/bookings",bookingRoutes);
app.use("/api/bookings",careRoutes);
app.use("/api/upload",uploadRoutes);
app.use("/api/services", serviceRoutes)
app.get("/", (req, res) => {
  res.send("ElderCare API Running...");
});

export default app;