import dotenv from "dotenv"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, ".env") })

import http from "http"
import { Server } from "socket.io"
import app from "./src/app.js"
import connectDB from "./src/config/db.js"

connectDB()

const PORT = process.env.PORT || 8000

const server = http.createServer(app)

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
})

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})