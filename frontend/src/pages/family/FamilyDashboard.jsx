import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../../context/AuthContext"
import { Link } from "react-router-dom"
import { useSocket } from "../../context/SocketContext"

export default function FamilyDashboard() {
  const { token, user } = useAuth()
  const { socket } = useSocket()
  const [bookings, setBookings] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` }
        const [bookingsRes, patientsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/bookings`, { headers }),
          axios.get(`${import.meta.env.VITE_API_URL}/patients`, { headers }),
        ])
        setBookings(bookingsRes.data)
        setPatients(patientsRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [token])

  useEffect(() => {
    if (!socket) return
    socket.on("bookingStatusUpdated", ({ bookingId, status }) => {
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status } : b
        )
      )
    })
    return () => {
      socket.off("bookingStatusUpdated")
    }
  }, [socket])

  const activeBookings = bookings.filter((b) => b.status === "in-progress")
  const upcomingBookings = bookings.filter((b) => b.status === "confirmed")
  const completedBookings = bookings.filter((b) => b.status === "completed")

  const statusColor = {
    requested: "bg-amber-50 text-amber-700",
    confirmed: "bg-blue-50 text-blue-700",
    "in-progress": "bg-teal-50 text-teal-700",
    completed: "bg-gray-50 text-gray-600",
    cancelled: "bg-red-50 text-red-600",
    rejected: "bg-red-50 text-red-600",
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
          Here's what's happening with your care plans today
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Patients", value: patients.length, sub: "Profiles linked" },
          { label: "Total Bookings", value: bookings.length, sub: "All time" },
          { label: "Active Now", value: activeBookings.length, sub: "In progress" },
          { label: "Completed", value: completedBookings.length, sub: "Sessions done" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
            <div className="text-2xl font-medium text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-400 mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-800">Recent Bookings</h2>
            <Link to="/family/bookings" className="text-xs text-teal-600 hover:underline">
              View all
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-3xl mb-2">📅</div>
              <p className="text-sm text-gray-500">No bookings yet</p>
              <Link
                to="/family/caregivers"
                className="text-xs text-teal-600 hover:underline mt-1 inline-block"
              >
                Book a caregiver
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 4).map((booking) => (
                <div
                  key={booking._id}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-800">
                      {booking.serviceType}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {booking.caregiverId?.userId?.name || "Caregiver"} ·{" "}
                      {new Date(booking.startDate).toLocaleDateString()}
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

        {/* My Patients */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-800">My Patients</h2>
            <Link to="/family/patients" className="text-xs text-teal-600 hover:underline">
              Manage
            </Link>
          </div>

          {patients.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-3xl mb-2">👴</div>
              <p className="text-sm text-gray-500">No patients added yet</p>
              <Link
                to="/family/patients"
                className="text-xs text-teal-600 hover:underline mt-1 inline-block"
              >
                Add a patient
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {patients.slice(0, 4).map((patient) => (
                <div
                  key={patient._id}
                  className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-sm">
                    {patient.gender === "female" ? "👵" : "👴"}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">{patient.name}</div>
                    <div className="text-xs text-gray-400">{patient.age} yrs · {patient.gender}</div>
                  </div>
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
            { label: "Add Patient", icon: "➕", path: "/family/patients" },
            { label: "Find Caregiver", icon: "🔍", path: "/family/caregivers" },
            { label: "My Bookings", icon: "📅", path: "/family/bookings" },
            { label: "Care Notes", icon: "📋", path: "/family/care-notes" },
          ].map((action, i) => (
            <Link
              key={i}
              to={action.path}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-gray-100 hover:border-teal-200 hover:bg-teal-50 transition text-center"
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-xs font-medium text-gray-700">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}