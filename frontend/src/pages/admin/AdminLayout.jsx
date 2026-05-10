import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const navItems = [
  { label: "Dashboard", icon: "📊", path: "/admin" },
  { label: "Verify Caregivers", icon: "✅", path: "/admin/verify" },
  { label: "User Management", icon: "👥", path: "/admin/users" },
  { label: "Bookings", icon: "📅", path: "/admin/bookings" },
  { label: "Services", icon: "🏥", path: "/admin/services" },
]

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-semibold text-sm">
            E
          </div>
          <span className="text-lg font-medium text-gray-800">
            ElderCare<span className="text-teal-600">+</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            👋 Hello, <span className="font-medium text-gray-800">{user?.name}</span>
          </span>
          <span className="bg-purple-50 text-purple-700 text-xs font-medium px-3 py-1 rounded-full">
            Admin
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-500 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="flex flex-1">

        {/* Sidebar */}
        <aside className="w-52 bg-white border-r border-gray-100 py-6 flex flex-col justify-between shrink-0">
          <div className="space-y-1 px-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition
                  ${location.pathname === item.path
                    ? "bg-purple-50 text-purple-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="px-4">
            <button
              onClick={handleLogout}
              className="w-full text-left text-sm text-red-400 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition"
            >
              🚪 Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  )
}