import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../../context/AuthContext"

const serviceNames = [
  "Nursing Care",
  "Elderly Attendant",
  "Physiotherapy",
  "Post-Hospital Care",
]

const emptyForm = {
  name: "Nursing Care",
  description: "",
  durationOptions: "",
  priceRange: "",
  requiredQualification: "",
}

export default function AdminServices() {
  const { token } = useAuth()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const headers = { Authorization: `Bearer ${token}` }

  const fetchServices = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/services/all`,
        { headers }
      )
      setServices(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    setSuccess("")
    try {
      const payload = {
        ...form,
        durationOptions: form.durationOptions
          .split(",")
          .map((d) => d.trim())
          .filter(Boolean),
      }
      if (editId) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/services/${editId}`,
          payload,
          { headers }
        )
        setSuccess("Service updated successfully")
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/services`,
          payload,
          { headers }
        )
        setSuccess("Service created successfully")
      }
      setForm(emptyForm)
      setEditId(null)
      setShowForm(false)
      fetchServices()
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (service) => {
    setForm({
      name: service.name,
      description: service.description,
      durationOptions: service.durationOptions?.join(", ") || "",
      priceRange: service.priceRange || "",
      requiredQualification: service.requiredQualification || "",
    })
    setEditId(service._id)
    setShowForm(true)
    setError("")
    setSuccess("")
  }

  const handleDeactivate = async (id) => {
    if (!window.confirm("Deactivate this service?")) return
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/services/${id}/deactivate`,
        {},
        { headers }
      )
      fetchServices()
    } catch (err) {
      console.error(err)
    }
  }

  const handleCancel = () => {
    setForm(emptyForm)
    setEditId(null)
    setShowForm(false)
    setError("")
    setSuccess("")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">Loading services...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-gray-900">Service Catalog</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage platform service categories
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          + Add Service
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-medium text-gray-800 mb-4">
            {editId ? "Edit Service" : "Add New Service"}
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Service Name
              </label>
              <select
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >
                {serviceNames.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Describe what this service includes..."
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Duration Options
                  <span className="text-gray-400 ml-1">(comma separated)</span>
                </label>
                <input
                  type="text"
                  name="durationOptions"
                  value={form.durationOptions}
                  onChange={handleChange}
                  placeholder="e.g. Hourly, Daily, Long-term"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Price Range
                </label>
                <input
                  type="text"
                  name="priceRange"
                  value={form.priceRange}
                  onChange={handleChange}
                  placeholder="e.g. ₹500 - ₹2000 per day"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Required Qualification
              </label>
              <input
                type="text"
                name="requiredQualification"
                value={form.requiredQualification}
                onChange={handleChange}
                placeholder="e.g. Registered Nurse (RN)"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition disabled:opacity-60"
              >
                {submitting ? "Saving..." : editId ? "Update Service" : "Add Service"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="border border-gray-200 text-gray-600 text-sm px-6 py-2.5 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services List */}
      {services.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="text-4xl mb-3">🏥</div>
          <p className="text-gray-600 font-medium mb-1">No services added yet</p>
          <p className="text-sm text-gray-400 mb-4">
            Add the platform service categories
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
          >
            + Add Service
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => (
            <div
              key={service._id}
              className={`bg-white rounded-xl border p-5 ${
                service.isActive
                  ? "border-gray-100"
                  : "border-red-100 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      {service.name}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      service.isActive
                        ? "bg-teal-50 text-teal-700"
                        : "bg-red-50 text-red-500"
                    }`}>
                      {service.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {service.priceRange && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-28">Price Range</span>
                    <span className="text-xs text-gray-700">{service.priceRange}</span>
                  </div>
                )}
                {service.durationOptions?.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-28">Duration</span>
                    <div className="flex gap-1 flex-wrap">
                      {service.durationOptions.map((d, i) => (
                        <span
                          key={i}
                          className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {service.requiredQualification && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-28">Qualification</span>
                    <span className="text-xs text-gray-700">
                      {service.requiredQualification}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="text-xs text-purple-600 hover:text-purple-700 border border-purple-100 hover:border-purple-300 px-3 py-1.5 rounded-lg transition"
                >
                  Edit
                </button>
                {service.isActive && (
                  <button
                    onClick={() => handleDeactivate(service._id)}
                    className="text-xs text-red-400 hover:text-red-600 border border-red-100 hover:border-red-300 px-3 py-1.5 rounded-lg transition"
                  >
                    Deactivate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}