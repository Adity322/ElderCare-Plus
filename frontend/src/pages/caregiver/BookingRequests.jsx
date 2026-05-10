import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../../context/AuthContext"

export default function BookingRequests() {
  const { token } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  const headers = { Authorization: `Bearer ${token}` }

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/bookings`,
        { headers }
      )
      const pending = res.data.filter((b) => b.status === "requested")
      setRequests(pending)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleStatus = async (id, status) => {
    setUpdating(id)
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/bookings/${id}/status`,
        { status },
        { headers }
      )
      fetchRequests()
    } catch (err) {
      console.error(err)
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">Loading requests...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-medium text-gray-900">Booking Requests</h1>
        <p className="text-sm text-gray-500 mt-1">
          Accept or reject incoming booking requests
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="text-4xl mb-3">📩</div>
          <p className="text-gray-600 font-medium mb-1">No pending requests</p>
          <p className="text-sm text-gray-400">
            New booking requests will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((booking) => (
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
                    <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                      New Request
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

              {/* Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Patient</div>
                  <div className="text-xs font-medium text-gray-700">
                    {booking.patientId?.name || "N/A"}
                  </div>
                  <div className="text-xs text-gray-400">
                    {booking.patientId?.age} yrs · {booking.patientId?.gender}
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

              {/* Patient Medical Info */}
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
                <button
                  onClick={() => handleStatus(booking._id, "confirmed")}
                  disabled={updating === booking._id}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium py-2.5 rounded-lg transition disabled:opacity-60"
                >
                  {updating === booking._id ? "Updating..." : "✅ Accept"}
                </button>
                <button
                  onClick={() => handleStatus(booking._id, "rejected")}
                  disabled={updating === booking._id}
                  className="flex-1 border border-red-200 text-red-500 hover:bg-red-50 text-sm font-medium py-2.5 rounded-lg transition disabled:opacity-60"
                >
                  ❌ Reject
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  )
}