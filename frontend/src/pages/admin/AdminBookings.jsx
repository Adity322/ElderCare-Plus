import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../../context/AuthContext"

const statusColor = {
  requested: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  "in-progress": "bg-teal-50 text-teal-700",
  completed: "bg-gray-50 text-gray-600",
  cancelled: "bg-red-50 text-red-500",
  rejected: "bg-red-50 text-red-500",
}

const tabs = ["all", "requested", "confirmed", "in-progress", "completed", "cancelled"]

export default function AdminBookings() {
  const { token } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [search, setSearch] = useState("")

  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
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
    fetchBookings()
  }, [])

  const filtered = bookings.filter((b) => {
    const matchTab = activeTab === "all" || b.status === activeTab
    const matchSearch =
      b.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.patientId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.serviceType?.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

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
      <div>
        <h1 className="text-xl font-medium text-gray-900">All Bookings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitor all platform bookings and service sessions
        </p>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by family name, patient or service..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap capitalize transition
              ${activeTab === tab
                ? "bg-purple-600 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-purple-300"
              }`}
          >
            {tab === "all"
              ? `All (${bookings.length})`
              : `${tab} (${bookings.filter((b) => b.status === tab).length})`
            }
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="text-xs text-gray-400">
        Showing {filtered.length} booking{filtered.length !== 1 ? "s" : ""}
      </div>

      {/* Bookings */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="text-4xl mb-3">📅</div>
          <p className="text-gray-600 font-medium mb-1">No bookings found</p>
          <p className="text-sm text-gray-400">
            Try adjusting your search or filter
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
                      {booking.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    ID: {booking._id.slice(-8).toUpperCase()} · {new Date(booking.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(booking.startDate).toLocaleDateString()}
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Family</div>
                  <div className="text-xs font-medium text-gray-700">
                    {booking.userId?.name || "N/A"}
                  </div>
                  <div className="text-xs text-gray-400">
                    {booking.userId?.email}
                  </div>
                </div>

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
                  <div className="text-xs text-gray-400 mb-1">Caregiver</div>
                  <div className="text-xs font-medium text-gray-700">
                    {booking.caregiverId?.userId?.name || "N/A"}
                  </div>
                  <div className="text-xs text-gray-400">
                    {booking.caregiverId?.qualifications}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Schedule</div>
                  <div className="text-xs font-medium text-gray-700 capitalize">
                    {booking.shift} shift
                  </div>
                  <div className="text-xs text-gray-400 capitalize">
                    {booking.duration}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  )
}