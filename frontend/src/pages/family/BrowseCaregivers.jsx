import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function BrowseCaregivers() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [caregivers, setCaregivers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterArea, setFilterArea] = useState("")

  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    const fetchCaregivers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/caregivers`,
          { headers }
        )
        setCaregivers(res.data)
        setFiltered(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchCaregivers()
  }, [])

  useEffect(() => {
    let result = caregivers
    if (search) {
      result = result.filter((c) =>
        c.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.qualifications?.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (filterArea) {
      result = result.filter((c) =>
        c.serviceAreas?.some((area) =>
          area.toLowerCase().includes(filterArea.toLowerCase())
        )
      )
    }
    setFiltered(result)
  }, [search, filterArea, caregivers])

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.round(rating) ? "text-amber-400" : "text-gray-200"}>
        ★
      </span>
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">Loading caregivers...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-medium text-gray-900">Find Caregivers</h1>
        <p className="text-sm text-gray-500 mt-1">
          Browse verified caregivers available in your area
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name or qualification..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <input
          type="text"
          placeholder="Filter by city or area..."
          value={filterArea}
          onChange={(e) => setFilterArea(e.target.value)}
          className="w-full md:w-56 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Results count */}
      <div className="text-xs text-gray-400">
        Showing {filtered.length} verified caregiver{filtered.length !== 1 ? "s" : ""}
      </div>

      {/* Caregiver Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-gray-600 font-medium mb-1">No caregivers found</p>
          <p className="text-sm text-gray-400">
            Try adjusting your search or area filter
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((caregiver) => (
            <div
              key={caregiver._id}
              className="bg-white rounded-xl border border-gray-100 p-5 hover:border-teal-200 transition"
            >
              {/* Top row */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-xl shrink-0">
                  {caregiver.profilePhoto ? (
                    <img
                      src={caregiver.profilePhoto}
                      alt={caregiver.userId?.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    "🧑‍⚕️"
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-900">
                      {caregiver.userId?.name || "Caregiver"}
                    </div>
                    <span className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-medium">
                      ✅ Verified
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {caregiver.qualifications}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex text-sm">
                      {renderStars(caregiver.rating)}
                    </div>
                    <span className="text-xs text-gray-400 ml-1">
                      {caregiver.rating > 0 ? caregiver.rating.toFixed(1) : "No ratings yet"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-24">Experience</span>
                  <span className="text-xs text-gray-700">
                    {caregiver.experienceYears} year{caregiver.experienceYears !== 1 ? "s" : ""}
                  </span>
                </div>

                {caregiver.certifications?.length > 0 && (
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-gray-400 w-24">Certifications</span>
                    <div className="flex flex-wrap gap-1">
                      {caregiver.certifications.map((cert, i) => (
                        <span
                          key={i}
                          className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {caregiver.serviceAreas?.length > 0 && (
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-gray-400 w-24">Service Areas</span>
                    <div className="flex flex-wrap gap-1">
                      {caregiver.serviceAreas.map((area, i) => (
                        <span
                          key={i}
                          className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full"
                        >
                          📍 {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Book Button */}
              <button
                onClick={() => navigate(`/family/book/${caregiver._id}`)}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium py-2.5 rounded-lg transition"
              >
                Book this caregiver
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}