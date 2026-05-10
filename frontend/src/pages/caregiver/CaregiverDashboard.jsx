import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function CaregiverDashboard() {
  const { token, user } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, profileRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/bookings`, { headers }),
          axios.get(`${import.meta.env.VITE_API_URL}/caregivers/me`, { headers }),
        ])
        setBookings(bookingsRes.data)
        setProfile(profileRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const requested = bookings.filter((b) => b.status === "requested")
  const confirmed = bookings.filter((b) => b.status === "confirmed")
  const inProgress = bookings.filter((b) => b.status === "in-progress")
  const completed = bookings.filter((b) => b.status === "completed")

  const statusColor = {
    requested: "bg-amber-50 text-amber-700",
    confirmed: "bg-blue-50 text-blue-700",
    "in-progress": "bg-teal-50 text-teal-700",
    completed: "bg-gray-50 text-gray-600",
    cancelled: "bg-red-50 text-red-500",
    rejected: "bg-red-50 text-red-500",
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-medium text-gray-900">
          Good morning, {user?.name} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Here's your work overview for today
        </p>
      </div>

      {/* Profile incomplete warning */}
      {!profile && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-amber-800">
              Complete your profile
            </div>
            <div className="text-xs text-amber-600 mt-0.5">
              Set up your qualifications and service areas to start receiving bookings
            </div>
          </div>
          <button
            onClick={() => navigate("/caregiver/profile")}
            className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium px-4 py-2 rounded-lg transition shrink-0 ml-4"
          >
            Setup Profile
          </button>
        </div>
      )}

      {/* Verification warning */}
      {profile && !profile.isVerified && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <div className="text-sm font-medium text-blue-800">
            Profile under review
          </div>
          <div className="text-xs text-blue-600 mt-0.5">
            Your profile is pending admin verification. You will be notified once approved.
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "New Requests", value: requested.length, sub: "Pending response", color: "text-amber-600" },
          { label: "Confirmed", value: confirmed.length, sub: "Upcoming sessions", color: "text-blue-600" },
          { label: "In Progress", value: inProgress.length, sub: "Active now", color: "text-teal-600" },
          { label: "Completed", value: completed.length, sub: "Total sessions", color: "text-gray-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
            <div className={`text-2xl font-medium ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-gray-400 mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Pending Requests */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-800">
              Pending Requests
              {requested.length > 0 && (
                <span className="ml-2 bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">
                  {requested.length}
                </span>
              )}
            </h2>
            <button
              onClick={() => navigate("/caregiver/requests")}
              className="text-xs text-blue-600 hover:underline"
            >
              View all
            </button>
          </div>

          {requested.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-3xl mb-2">📩</div>
              <p className="text-sm text-gray-500">No pending requests</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requested.slice(0, 3).map((booking) => (
                <div key={booking._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-gray-800">
                      {booking.serviceType}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {booking.patientId?.name} · {new Date(booking.startDate).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full">
                    Requested
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-800">Upcoming Sessions</h2>
            <button
              onClick={() => navigate("/caregiver/schedule")}
              className="text-xs text-blue-600 hover:underline"
            >
              View all
            </button>
          </div>

          {confirmed.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-3xl mb-2">📅</div>
              <p className="text-sm text-gray-500">No upcoming sessions</p>
            </div>
          ) : (
            <div className="space-y-3">
              {confirmed.slice(0, 3).map((booking) => (
                <div key={booking._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-gray-800">
                      {booking.serviceType}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {booking.patientId?.name} · {new Date(booking.startDate).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColor[booking.status]}`}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-sm font-medium text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "My Profile", icon: "👤", path: "/caregiver/profile" },
            { label: "Requests", icon: "📩", path: "/caregiver/requests" },
            { label: "Schedule", icon: "📅", path: "/caregiver/schedule" },
            { label: "Care Notes", icon: "📋", path: "/caregiver/notes" },
          ].map((action, i) => (
            <button
              key={i}
              onClick={() => navigate(action.path)}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition text-center"
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-xs font-medium text-gray-700">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}