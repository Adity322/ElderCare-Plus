import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"

const statusColor = {
  confirmed: "bg-blue-50 text-blue-700",
  "in-progress": "bg-teal-50 text-teal-700",
  completed: "bg-gray-50 text-gray-600",
  cancelled: "bg-red-50 text-red-500",
  rejected: "bg-red-50 text-red-500",
}

const tabs = ["upcoming", "in-progress", "completed"]

export default function MySchedule() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("upcoming")
  const [updating, setUpdating] = useState(null)

  const headers = { Authorization: `Bearer ${token}` }

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/bookings`,
        { headers }
      )
      setBookings(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleStatus = async (id, status) => {
    setUpdating(id)
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/bookings/${id}/status`,
        { status },
        { headers }
      )
      fetchBookings()
    } catch (err) {
      console.error(err)
    } finally {
      setUpdating(null)
    }
  }

  const filtered = bookings.filter((b) => {
    if (activeTab === "upcoming") return b.status === "confirmed"
    if (activeTab === "in-progress") return b.status === "in-progress"
    if (activeTab === "completed") return b.status === "completed"
    return true
  })

  const tabCount = (tab) => {
    if (tab === "upcoming") return bookings.filter((b) => b.status === "confirmed").length
    if (tab === "in-progress") return bookings.filter((b) => b.status === "in-progress").length
    if (tab === "completed") return bookings.filter((b) => b.status === "completed").length
    return 0
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">Loading schedule...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-medium text-gray-900">My Schedule</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your upcoming and active sessions
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition
              ${activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300"
              }`}
          >
            {tab} ({tabCount(tab)})
          </button>
        ))}
      </div>

      {/* Bookings */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="text-4xl mb-3">📅</div>
          <p className="text-gray-600 font-medium mb-1">
            No {activeTab} sessions
          </p>
          <p className="text-sm text-gray-400">
            {activeTab === "upcoming"
              ? "Accept booking requests to see them here"
              : `No ${activeTab} sessions found`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-xl border border-gray-100 p-5"
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      {booking.serviceType}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[booking.status]}`}>
                      {booking.status === "in-progress" ? "In Progress" : booking.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    ID: {booking._id.slice(-8).toUpperCase()}
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(booking.startDate).toLocaleDateString()}
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Patient</div>
                  <div className="text-xs font-medium text-gray-700">
                    {booking.patientId?.name || "N/A"}
                  </div>
                  <div className="text-xs text-gray-400">
                    {booking.patientId?.age} yrs
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Family</div>
                  <div className="text-xs font-medium text-gray-700">
                    {booking.userId?.name || "N/A"}
                  </div>
                  <div className="text-xs text-gray-400">
                    {booking.userId?.phone}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Shift</div>
                  <div className="text-xs font-medium text-gray-700 capitalize">
                    {booking.shift}
                  </div>
                  <div className="text-xs text-gray-400 capitalize">
                    {booking.duration}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Mobility</div>
                  <div className="text-xs font-medium text-gray-700">
                    {booking.patientId?.mobilityStatus || "N/A"}
                  </div>
                </div>
              </div>

              {/* Medical Info */}
              {booking.patientId?.medicalConditions && (
                <div className="bg-blue-50 rounded-lg px-4 py-2.5 mb-4">
                  <span className="text-xs text-blue-600 font-medium">
                    Medical Conditions:{" "}
                  </span>
                  <span className="text-xs text-blue-800">
                    {booking.patientId.medicalConditions}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                {booking.status === "confirmed" && (
                  <button
                    onClick={() => handleStatus(booking._id, "in-progress")}
                    disabled={updating === booking._id}
                    className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition disabled:opacity-60"
                  >
                    {updating === booking._id ? "Updating..." : "▶ Start Session"}
                  </button>
                )}

                {booking.status === "in-progress" && (
                  <>
                    <button
                      onClick={() => handleStatus(booking._id, "completed")}
                      disabled={updating === booking._id}
                      className="bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium px-5 py-2 rounded-lg transition disabled:opacity-60"
                    >
                      {updating === booking._id ? "Updating..." : "✅ Complete Session"}
                    </button>
                    <button
                      onClick={() => navigate(`/caregiver/notes?bookingId=${booking._id}`)}
                      className="border border-blue-200 text-blue-600 hover:bg-blue-50 text-sm font-medium px-5 py-2 rounded-lg transition"
                    >
                      📋 Add Care Note
                    </button>
                  </>
                )}

                {booking.status === "completed" && (
                  <button
                    onClick={() => navigate(`/caregiver/notes?bookingId=${booking._id}`)}
                    className="border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium px-5 py-2 rounded-lg transition"
                  >
                    📋 View Care Notes
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  )
}