import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../../context/AuthContext"

export default function UserManagement() {
  const { token } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterRole, setFilterRole] = useState("all")

  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/users`,
          { headers }
        )
        setUsers(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    const matchRole = filterRole === "all" || u.role === filterRole
    return matchSearch && matchRole
  })

  const roleColor = {
    user: "bg-teal-50 text-teal-700",
    caregiver: "bg-blue-50 text-blue-700",
    admin: "bg-purple-50 text-purple-700",
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">Loading users...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-medium text-gray-900">User Management</h1>
        <p className="text-sm text-gray-500 mt-1">
          View and manage all platform users
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="w-full md:w-40 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
        >
          <option value="all">All Roles</option>
          <option value="user">Family</option>
          <option value="caregiver">Caregiver</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Family Users", value: users.filter((u) => u.role === "user").length, color: "text-teal-600" },
          { label: "Caregivers", value: users.filter((u) => u.role === "caregiver").length, color: "text-blue-600" },
          { label: "Admins", value: users.filter((u) => u.role === "admin").length, color: "text-purple-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <div className={`text-2xl font-medium ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Results */}
      <div className="text-xs text-gray-400">
        Showing {filtered.length} of {users.length} users
      </div>

      {/* Users Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="text-4xl mb-3">👥</div>
          <p className="text-gray-600 font-medium mb-1">No users found</p>
          <p className="text-sm text-gray-400">Try adjusting your search</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-4 px-5 py-3 bg-gray-50 border-b border-gray-100">
            <div className="text-xs font-medium text-gray-500">Name</div>
            <div className="text-xs font-medium text-gray-500">Email</div>
            <div className="text-xs font-medium text-gray-500">Phone</div>
            <div className="text-xs font-medium text-gray-500">Role</div>
          </div>
          <div className="divide-y divide-gray-50">
            {filtered.map((user) => (
              <div key={user._id} className="grid grid-cols-4 px-5 py-3 items-center hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600 shrink-0">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-800 font-medium truncate">
                    {user.name}
                  </span>
                </div>
                <div className="text-sm text-gray-500 truncate">{user.email}</div>
                <div className="text-sm text-gray-500">{user.phone || "—"}</div>
                <div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${roleColor[user.role]}`}>
                    {user.role === "user" ? "Family" : user.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}