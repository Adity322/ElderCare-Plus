import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../../context/AuthContext"

const emptyForm = {
  qualifications: "",
  experienceYears: "",
  certifications: "",
  serviceAreas: "",
}

export default function CaregiverProfile() {
  const { token } = useAuth()

  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [uploading, setUploading] = useState(false)
  const [uploadingDocs, setUploadingDocs] = useState(false)
  const [photoUrl, setPhotoUrl] = useState("")
  const [documents, setDocuments] = useState([])
  const [reviews, setReviews] = useState([])

  const headers = {
    Authorization: `Bearer ${token}`,
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/caregivers/me`,
          { headers }
        )

        if (profileRes.data) {
          setProfile(profileRes.data)
          setPhotoUrl(profileRes.data.profilePhoto || "")
          setDocuments(profileRes.data.documents || [])

          setForm({
            qualifications:
              profileRes.data.qualifications || "",

            experienceYears:
              profileRes.data.experienceYears || "",

            certifications:
              profileRes.data.certifications?.join(", ") ||
              "",

            serviceAreas:
              profileRes.data.serviceAreas?.join(", ") ||
              "",
          })
        }
      } catch (err) {
        console.error("Profile fetch error:", err)
      }

      try {
        const reviewsRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/caregivers/my-reviews`,
          { headers }
        )

        setReviews(reviewsRes.data || [])
      } catch (err) {
        console.error("Reviews fetch error:", err)
      }

      setLoading(false)
    }

    fetchProfile()
  }, [])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]

    if (!file) return

    setUploading(true)
    setError("")

    try {
      const formData = new FormData()

      formData.append("photo", file)

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/caregivers/profile/photo`,
        formData,
        {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
        }
      )

      setPhotoUrl(res.data.profilePhoto)

      setSuccess("Photo uploaded successfully")
    } catch (err) {
      setError("Photo upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleDocumentUpload = async (e) => {
    const files = Array.from(e.target.files)

    if (!files.length) return

    setUploadingDocs(true)
    setError("")

    try {
      const formData = new FormData()

      files.forEach((file) => {
        formData.append("documents", file)
      })

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/upload/documents`,
        formData,
        {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
        }
      )

      setDocuments(res.data.documents || [])

      setSuccess("Documents uploaded successfully")
    } catch (err) {
      setError("Document upload failed")
    } finally {
      setUploadingDocs(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const payload = {
        qualifications: form.qualifications,

        experienceYears: Number(
          form.experienceYears
        ),

        certifications: form.certifications
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),

        serviceAreas: form.serviceAreas
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),

        profilePhoto: photoUrl,
      }

      if (profile) {
        const res = await axios.put(
          `${import.meta.env.VITE_API_URL}/caregivers/profile`,
          payload,
          { headers }
        )

        setProfile(res.data)

        setSuccess("Profile updated successfully")
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/caregivers/profile`,
          payload,
          { headers }
        )

        setProfile(res.data)

        setSuccess("Profile created successfully")
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong"
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">
          Loading profile...
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-medium text-gray-900">
          My Profile
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Set up your profile to start receiving bookings
        </p>
      </div>

      {/* Verification Status */}
      {profile && (
        <div
          className={`rounded-xl p-4 ${
            profile.isVerified
              ? "bg-teal-50 border border-teal-100"
              : "bg-amber-50 border border-amber-100"
          }`}
        >
          <div
            className={`text-sm font-medium ${
              profile.isVerified
                ? "text-teal-800"
                : "text-amber-800"
            }`}
          >
            {profile.isVerified
              ? "✅ Profile Verified — you are visible to families"
              : "⏳ Pending Verification — admin review in progress"}
          </div>

          {!profile.isVerified && (
            <div className="text-xs text-amber-600 mt-0.5">
              Your profile will go live once admin approves
              your documents
            </div>
          )}
        </div>
      )}

      {/* Profile Photo */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-sm font-medium text-gray-800 mb-4">
          Profile Photo
        </h2>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center overflow-hidden shrink-0">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Profile"
                className="w-16 h-16 object-cover rounded-full"
              />
            ) : (
              <span className="text-3xl">🧑‍⚕️</span>
            )}
          </div>

          <div>
            <label className="cursor-pointer bg-white border border-gray-200 hover:border-blue-300 text-gray-600 text-sm px-4 py-2 rounded-lg transition inline-block">
              {uploading
                ? "Uploading..."
                : "Upload Photo"}

              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>

            <p className="text-xs text-gray-400 mt-1">
              JPG or PNG, max 2MB
            </p>
          </div>
        </div>
      </div>

      {/* Documents Upload */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-sm font-medium text-gray-800 mb-1">
          Verification Documents
        </h2>

        <p className="text-xs text-gray-400 mb-4">
          Upload your certificates, ID, and qualification
          documents for admin verification
        </p>

        <label className="cursor-pointer inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-blue-300 text-gray-600 text-sm px-4 py-2 rounded-lg transition">
          {uploadingDocs
            ? "Uploading..."
            : "📎 Upload Documents"}

          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            multiple
            onChange={handleDocumentUpload}
            className="hidden"
            disabled={uploadingDocs}
          />
        </label>

        <p className="text-xs text-gray-400 mt-2">
          JPG, PNG or PDF · Max 5 files at once
        </p>

        {documents.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="text-xs text-gray-500 font-medium mb-2">
              Uploaded Documents ({documents.length})
            </div>

            {documents.map((doc, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {doc
                      .toLowerCase()
                      .includes(".pdf") ||
                    doc.includes("/raw/")
                      ? "📄"
                      : "🖼️"}
                  </span>

                  <span className="text-xs text-gray-600 truncate max-w-xs">
                    Document {i + 1}
                  </span>
                </div>

                <a
                  href={
                    doc.includes("/raw/")
                      ? doc
                      : doc.replace(
                          "/image/upload/",
                          "/image/upload/fl_attachment/"
                        )
                  }
                  target="_blank"
                  rel="noreferrer"
                  download={`document-${i + 1}`}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-sm font-medium text-gray-800 mb-4">
          Professional Details
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-teal-50 text-teal-700 text-sm px-4 py-3 rounded-lg mb-4">
            ✅ {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Qualifications
            </label>

            <input
              type="text"
              name="qualifications"
              value={form.qualifications}
              onChange={handleChange}
              required
              placeholder="e.g. Registered Nurse (RN), BSc Nursing"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Years of Experience
            </label>

            <input
              type="number"
              name="experienceYears"
              value={form.experienceYears}
              onChange={handleChange}
              required
              min="0"
              placeholder="e.g. 5"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Certifications
              <span className="text-gray-400 ml-1">
                (comma separated)
              </span>
            </label>

            <input
              type="text"
              name="certifications"
              value={form.certifications}
              onChange={handleChange}
              placeholder="e.g. BLS, First Aid, Elderly Care Certificate"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Service Areas
              <span className="text-gray-400 ml-1">
                (comma separated)
              </span>
            </label>

            <input
              type="text"
              name="serviceAreas"
              value={form.serviceAreas}
              onChange={handleChange}
              placeholder="e.g. Delhi, Noida, 110001"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg transition disabled:opacity-60"
          >
            {submitting
              ? "Saving..."
              : profile
              ? "Update Profile"
              : "Create Profile"}
          </button>
        </form>
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-medium text-gray-800 mb-4">
            My Reviews

            <span className="ml-2 bg-amber-50 text-amber-700 text-xs px-2 py-0.5 rounded-full">
              ⭐{" "}
              {Number(profile?.rating || 0).toFixed(1)}{" "}
              avg
            </span>
          </h2>

          <div className="space-y-3">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-gray-50 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex text-amber-400 text-sm">
                    {Array.from(
                      { length: 5 },
                      (_, i) => (
                        <span key={i}>
                          {i < review.rating
                            ? "★"
                            : "☆"}
                        </span>
                      )
                    )}
                  </div>

                  <span className="text-xs text-gray-400">
                    {new Date(
                      review.createdAt
                    ).toLocaleDateString()}
                  </span>
                </div>

                {review.comment && (
                  <p className="text-sm text-gray-600">
                    {review.comment}
                  </p>
                )}

                <p className="text-xs text-gray-400 mt-1">
                  —{" "}
                  {review.userId?.name ||
                    "Family User"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
