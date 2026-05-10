import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../../context/AuthContext"
import { useParams, useNavigate } from "react-router-dom"


const emptyForm = {
  patientId: "",
  serviceType: "",
  startDate: "",
  shift: "morning",
  duration: "daily",
}

export default function BookService() {
  const { token } = useAuth()
  const { caregiverId } = useParams()
  const navigate = useNavigate()

  const [serviceTypes, setServiceTypes] = useState([])
  const [caregiver, setCaregiver] = useState(null)
  const [patients, setPatients] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [caregiverRes, patientsRes, servicesRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_API_URL}/caregivers/${caregiverId}`,
            { headers }
          ),
          axios.get(
            `${import.meta.env.VITE_API_URL}/patients`,
            { headers }
          ),
          axios.get(
            `${import.meta.env.VITE_API_URL}/services`
          ),
        ])
        setCaregiver(caregiverRes.data)
        setPatients(patientsRes.data)
        setServiceTypes(servicesRes.data)

        if (patientsRes.data.length > 0) {
          setForm((f) => ({ ...f, patientId: patientsRes.data[0]._id }))
        }
        if (servicesRes.data.length > 0) {
          setForm((f) => ({ ...f, serviceType: servicesRes.data[0].name }))
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [caregiverId])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.patientId) {
      setError("Please add a patient profile first before booking")
      return
    }
    setSubmitting(true)
    setError("")
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/bookings`,
        { ...form, caregiverId },
        { headers }
      )
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-12 text-center">
        <div className="bg-white rounded-xl border border-gray-100 p-10">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Booking Request Sent!
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Your booking request has been sent to{" "}
            <span className="font-medium text-gray-700">
              {caregiver?.userId?.name}
            </span>
            . You will be notified once they accept.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("/family/bookings")}
              className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
            >
              View My Bookings
            </button>
            <button
              onClick={() => navigate("/family/caregivers")}
              className="border border-gray-200 text-gray-600 text-sm px-5 py-2.5 rounded-lg hover:bg-gray-50 transition"
            >
              Browse More
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-medium text-gray-900">Book a Service</h1>
        <p className="text-sm text-gray-500 mt-1">
          Fill in the details to send a booking request
        </p>
      </div>

      {/* Caregiver Info */}
      {caregiver && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-xl shrink-0">
            {caregiver.profilePhoto ? (
              <img
                src={caregiver.profilePhoto}
                alt={caregiver.userId?.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : "🧑‍⚕️"}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">
              {caregiver.userId?.name}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              {caregiver.qualifications} · {caregiver.experienceYears} years experience
            </div>
            <div className="flex gap-1 mt-1">
              {caregiver.serviceAreas?.map((area, i) => (
                <span key={i} className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full">
                  📍 {area}
                </span>
              ))}
            </div>
          </div>
          <span className="ml-auto text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded-full font-medium">
            ✅ Verified
          </span>
        </div>
      )}

      {/* Booking Form */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {patients.length === 0 && (
          <div className="bg-amber-50 text-amber-700 text-sm px-4 py-3 rounded-lg mb-4">
            You have no patient profiles yet.{" "}
            <span
              onClick={() => navigate("/family/patients")}
              className="underline cursor-pointer font-medium"
            >
              Add a patient first
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Patient */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Select Patient
            </label>
            <select
              name="patientId"
              value={form.patientId}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              {patients.length === 0 ? (
                <option value="">No patients found</option>
              ) : (
                patients.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} · {p.age} yrs · {p.gender}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Service Type */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Service Type
            </label>
            <select
              name="serviceType"
              value={form.serviceType}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              {serviceTypes.map((s) => (
                <option key={s._id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split("T")[0]}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Shift */}
          <div>
            <label className="text-xs text-gray-500 mb-2 block">
              Shift Timing
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["morning", "evening", "night"].map((shift) => (
                <label
                  key={shift}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer transition text-center
                    ${form.shift === shift
                      ? "border-teal-500 bg-teal-50 text-teal-700"
                      : "border-gray-200 text-gray-600 hover:border-teal-200"
                    }`}
                >
                  <input
                    type="radio"
                    name="shift"
                    value={shift}
                    checked={form.shift === shift}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <span className="text-xl mb-1">
                    {shift === "morning" ? "🌅" : shift === "evening" ? "🌆" : "🌙"}
                  </span>
                  <span className="text-xs font-medium capitalize">{shift}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="text-xs text-gray-500 mb-2 block">
              Duration
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["hourly", "daily", "long-term"].map((dur) => (
                <label
                  key={dur}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer transition text-center
                    ${form.duration === dur
                      ? "border-teal-500 bg-teal-50 text-teal-700"
                      : "border-gray-200 text-gray-600 hover:border-teal-200"
                    }`}
                >
                  <input
                    type="radio"
                    name="duration"
                    value={dur}
                    checked={form.duration === dur}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <span className="text-xl mb-1">
                    {dur === "hourly" ? "⏰" : dur === "daily" ? "📅" : "📆"}
                  </span>
                  <span className="text-xs font-medium capitalize">{dur}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting || patients.length === 0}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium py-2.5 rounded-lg transition disabled:opacity-60"
            >
              {submitting ? "Sending request..." : "Send Booking Request"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/family/caregivers")}
              className="border border-gray-200 text-gray-600 text-sm px-5 py-2.5 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}