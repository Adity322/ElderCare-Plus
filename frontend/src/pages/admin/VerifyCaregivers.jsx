import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../../context/AuthContext"

export default function VerifyCaregivers() {
  const { token } = useAuth()

  const [caregivers, setCaregivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)
  const [activeTab, setActiveTab] = useState("pending")

  const headers = {
    Authorization: `Bearer ${token}`,
  }

  const fetchCaregivers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/caregivers/all`,
        { headers }
      )

      setCaregivers(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCaregivers()
  }, [])

  const handleVerify = async (id) => {
    setUpdating(id)

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/caregivers/${id}/verify`,
        {},
        { headers }
      )

      fetchCaregivers()
    } catch (err) {
      console.error(err)
    } finally {
      setUpdating(null)
    }
  }

  const filtered = caregivers.filter((c) =>
    activeTab === "pending"
      ? !c.isVerified
      : c.isVerified
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">
          Loading caregivers...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-medium text-gray-900">
          Verify Caregivers
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Review and approve caregiver applications
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {["pending", "verified"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition
              ${
                activeTab === tab
                  ? "bg-purple-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-purple-300"
              }`}
          >
            {tab} (
            {
              caregivers.filter((c) =>
                tab === "pending"
                  ? !c.isVerified
                  : c.isVerified
              ).length
            }
            )
          </button>
        ))}
      </div>

      {/* Caregiver Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="text-4xl mb-3">
            {activeTab === "pending"
              ? "✅"
              : "🧑‍⚕️"}
          </div>

          <p className="text-gray-600 font-medium mb-1">
            {activeTab === "pending"
              ? "No pending verifications"
              : "No verified caregivers yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">

          {filtered.map((caregiver) => (
            <div
              key={caregiver._id}
              className="bg-white rounded-xl border border-gray-100 p-5"
            >

              {/* Top Row */}
              <div className="flex items-start justify-between mb-4">

                <div className="flex items-center gap-3">

                  <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center overflow-hidden shrink-0">

                    {caregiver.profilePhoto ? (
                      <img
                        src={caregiver.profilePhoto}
                        alt={caregiver.userId?.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">
                        🧑‍⚕️
                      </span>
                    )}

                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {caregiver.userId?.name}
                    </div>

                    <div className="text-xs text-gray-400 mt-0.5">
                      {caregiver.userId?.email}
                    </div>

                    <div className="text-xs text-gray-400">
                      {caregiver.userId?.phone}
                    </div>
                  </div>

                </div>

                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium
                    ${
                      caregiver.isVerified
                        ? "bg-teal-50 text-teal-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                >
                  {caregiver.isVerified
                    ? "✅ Verified"
                    : "⏳ Pending"}
                </span>

              </div>

              {/* Details */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">
                    Qualifications
                  </div>

                  <div className="text-xs font-medium text-gray-700">
                    {caregiver.qualifications}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">
                    Experience
                  </div>

                  <div className="text-xs font-medium text-gray-700">
                    {caregiver.experienceYears} years
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">
                    Service Areas
                  </div>

                  <div className="text-xs font-medium text-gray-700">
                    {caregiver.serviceAreas?.join(", ") ||
                      "Not set"}
                  </div>
                </div>

              </div>

              {/* Certifications */}
              {caregiver.certifications?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">

                  {caregiver.certifications.map((cert, i) => (
                    <span
                      key={i}
                      className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full"
                    >
                      {cert}
                    </span>
                  ))}

                </div>
              )}

              {/* Documents */}
              {caregiver.documents?.length > 0 && (
                <div className="mb-4">

                  <div className="text-xs text-gray-500 font-medium mb-2">
                    Uploaded Documents (
                    {caregiver.documents.length}
                    )
                  </div>

                  <div className="flex flex-wrap gap-2">

                    {caregiver.documents.map((doc, i) => (
                      <a
                        key={i}
                        href={doc}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-xs bg-gray-50 border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:border-purple-300 transition"
                      >
                        {doc.endsWith(".pdf")
                          ? "📄"
                          : "🖼️"}

                        Document {i + 1}
                      </a>
                    ))}

                  </div>

                </div>
              )}

              {/* Actions */}
              {!caregiver.isVerified && (
                <div className="flex gap-3">

                  <button
                    onClick={() =>
                      handleVerify(caregiver._id)
                    }
                    disabled={
                      updating === caregiver._id
                    }
                    className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition disabled:opacity-60"
                  >
                    {updating === caregiver._id
                      ? "Approving..."
                      : "✅ Approve"}
                  </button>

                </div>
              )}

            </div>
          ))}

        </div>
      )}

    </div>
  )
}