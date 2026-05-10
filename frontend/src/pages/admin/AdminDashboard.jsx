import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function AdminDashboard() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCaregivers: 0,
    pendingVerification: 0,
    totalBookings: 0,
    completedBookings: 0,
    activeBookings: 0,
  })
  const [recentBookings, setRecentBookings] = useState([])
  const [pendingCaregivers, setPendingCaregivers] = useState([])
  const [loading, setLoading] = useState(true)

  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, caregiversRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/bookings`, { headers }),
          axios.get(`${import.meta.env.VITE_API_URL}/caregivers/all`, { headers }),
        ])

        const bookings = bookingsRes.data
        const caregivers = caregiversRes.data

        setRecentBookings(bookings.slice(0, 5))
        setPendingCaregivers(
          caregivers.filter((c) => !c.isVerified).slice(0, 3)
        )

        setStats({
          totalCaregivers: caregivers.length,
          pendingVerification: caregivers.filter((c) => !c.isVerified).length,
          totalBookings: bookings.length,
          completedBookings: bookings.filter((b) => b.status === "completed").length,
          activeBookings: bookings.filter((b) => b.status === "in-progress").length,
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

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
        <h1 className="text-xl font-medium text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Platform overview and management
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Total Caregivers", value: stats.totalCaregivers, sub: "On platform", color: "text-blue-600" },
          { label: "Pending Verification", value: stats.pendingVerification, sub: "Awaiting review", color: "text-amber-600" },
          { label: "Total Bookings", value: stats.totalBookings, sub: "All time", color: "text-gray-700" },
          { label: "Active Sessions", value: stats.activeBookings, sub: "In progress now", color: "text-teal-600" },
          { label: "Completed Sessions", value: stats.completedBookings, sub: "Successfully done", color: "text-green-600" },
          {
            label: "Completion Rate",
            value: stats.totalBookings > 0
              ? `${Math.round((stats.completedBookings / stats.totalBookings) * 100)}%`
              : "0%",
            sub: "Of all bookings",
            color: "text-purple-600"
          },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
            <div className={`text-2xl font-medium ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-gray-400 mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Pending Verification */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-800">
              Pending Verifications
              {stats.pendingVerification > 0 && (
                <span className="ml-2 bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">
                  {stats.pendingVerification}
                </span>
              )}
            </h2>
            <button
              onClick={() => navigate("/admin/verify")}
              className="text-xs text-purple-600 hover:underline"
            >
              View all
            </button>
          </div>

          {pendingCaregivers.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-3xl mb-2">✅</div>
              <p className="text-sm text-gray-500">All caregivers verified</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingCaregivers.map((caregiver) => (
                <div key={caregiver._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-sm">
                      🧑‍⚕️
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">
                        {caregiver.userId?.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {caregiver.qualifications}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full">
                    Pending
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-800">Recent Bookings</h2>
            <button
              onClick={() => navigate("/admin/bookings")}
              className="text-xs text-purple-600 hover:underline"
            >
              View all
            </button>
          </div>

          {recentBookings.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-3xl mb-2">📅</div>
              <p className="text-sm text-gray-500">No bookings yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div key={booking._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-gray-800">
                      {booking.serviceType}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {booking.userId?.name} · {new Date(booking.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[booking.status]}`}>
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
            { label: "Verify Caregivers", icon: "✅", path: "/admin/verify" },
            { label: "Manage Users", icon: "👥", path: "/admin/users" },
            { label: "All Bookings", icon: "📅", path: "/admin/bookings" },
            { label: "Services", icon: "🏥", path: "/admin/services" },
          ].map((action, i) => (
            <button
              key={i}
              onClick={() => navigate(action.path)}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition text-center"
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