import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"

const statusColor = {
  requested: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  "in-progress": "bg-teal-50 text-teal-700",
  completed: "bg-gray-50 text-gray-600",
  cancelled: "bg-red-50 text-red-500",
  rejected: "bg-red-50 text-red-500",
}

const statusLabel = {
  requested: "Requested",
  confirmed: "Confirmed",
  "in-progress": "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
  rejected: "Rejected",
}

const tabs = ["all", "requested", "confirmed", "in-progress", "completed", "cancelled"]

export default function MyBookings() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [cancelling, setCancelling] = useState(null)

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

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return
    setCancelling(id)
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/bookings/${id}`,
        { headers }
      )
      fetchBookings()
    } catch (err) {
      console.error(err)
    } finally {
      setCancelling(null)
    }
  }

  const filtered = activeTab === "all"
    ? bookings
    : bookings.filter((b) => b.status === activeTab)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">Loading bookings...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-gray-900">My Bookings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track all your care service bookings
          </p>
        </div>
        <button
          onClick={() => navigate("/family/caregivers")}
          className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          + New Booking
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition
              ${activeTab === tab
                ? "bg-teal-600 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-teal-300"
              }`}
          >
            {tab === "all" ? `All (${bookings.length})` : statusLabel[tab]}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="text-4xl mb-3">📅</div>
          <p className="text-gray-600 font-medium mb-1">No bookings found</p>
          <p className="text-sm text-gray-400 mb-4">
            {activeTab === "all"
              ? "You have not made any bookings yet"
              : `No ${statusLabel[activeTab]} bookings`}
          </p>
          {activeTab === "all" && (
            <button
              onClick={() => navigate("/family/caregivers")}
              className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
            >
              Browse Caregivers
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-xl border border-gray-100 p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      {booking.serviceType}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[booking.status]}`}>
                      {statusLabel[booking.status]}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Booking ID: {booking._id.slice(-8).toUpperCase()}
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(booking.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Details Grid */}
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
                  <div className="text-xs text-gray-400 mb-1">Caregiver</div>
                  <div className="text-xs font-medium text-gray-700">
                    {booking.caregiverId?.userId?.name || "N/A"}
                  </div>
                  <div className="text-xs text-gray-400">
                    {booking.caregiverId?.qualifications}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Start Date</div>
                  <div className="text-xs font-medium text-gray-700">
                    {new Date(booking.startDate).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-400 capitalize">
                    {booking.shift} shift
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Duration</div>
                  <div className="text-xs font-medium text-gray-700 capitalize">
                    {booking.duration}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {booking.status === "requested" && (
                  <button
                    onClick={() => handleCancel(booking._id)}
                    disabled={cancelling === booking._id}
                    className="text-xs text-red-500 hover:text-red-700 border border-red-100 hover:border-red-300 px-3 py-1.5 rounded-lg transition disabled:opacity-60"
                  >
                    {cancelling === booking._id ? "Cancelling..." : "Cancel Booking"}
                  </button>
                )}
                {booking.status === "completed" && (
                  <button
                    onClick={() => navigate("/family/care-notes")}
                    className="text-xs text-teal-600 hover:text-teal-700 border border-teal-100 hover:border-teal-300 px-3 py-1.5 rounded-lg transition"
                  >
                    View Care Notes
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