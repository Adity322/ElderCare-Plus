import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../../context/AuthContext"

const emptyForm = {
  name: "",
  age: "",
  gender: "male",
  medicalConditions: "",
  mobilityStatus: "Independent",
  specialRequirements: "",
}

export default function MyPatients() {
  const { token } = useAuth()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const headers = { Authorization: `Bearer ${token}` }

  const fetchPatients = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/patients`,
        { headers }
      )
      setPatients(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    try {
      if (editId) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/patients/${editId}`,
          form,
          { headers }
        )
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/patients`,
          form,
          { headers }
        )
      }
      setForm(emptyForm)
      setEditId(null)
      setShowForm(false)
      fetchPatients()
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (patient) => {
    setForm({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      medicalConditions: patient.medicalConditions,
      mobilityStatus: patient.mobilityStatus,
      specialRequirements: patient.specialRequirements || "",
    })
    setEditId(patient._id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this patient?")) return
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/patients/${id}`,
        { headers }
      )
      fetchPatients()
    } catch (err) {
      console.error(err)
    }
  }

  const handleCancel = () => {
    setForm(emptyForm)
    setEditId(null)
    setShowForm(false)
    setError("")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">Loading patients...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-gray-900">My Patients</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your elderly family members
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          + Add Patient
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-medium text-gray-800 mb-4">
            {editId ? "Edit Patient" : "Add New Patient"}
          </h2>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g. Ramesh Kumar"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Age</label>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                required
                placeholder="e.g. 72"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Mobility Status</label>
              <select
                name="mobilityStatus"
                value={form.mobilityStatus}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option>Independent</option>
                <option>Needs Assistance</option>
                <option>Bedridden</option>
                <option>Wheelchair Bound</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-gray-500 mb-1 block">Medical Conditions</label>
              <input
                type="text"
                name="medicalConditions"
                value={form.medicalConditions}
                onChange={handleChange}
                placeholder="e.g. Diabetes, Hypertension, Arthritis"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-gray-500 mb-1 block">Special Requirements</label>
              <textarea
                name="specialRequirements"
                value={form.specialRequirements}
                onChange={handleChange}
                rows={3}
                placeholder="Any special care instructions or requirements..."
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
            </div>

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition disabled:opacity-60"
              >
                {submitting ? "Saving..." : editId ? "Update Patient" : "Add Patient"}
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

      {/* Patient Cards */}
      {patients.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="text-4xl mb-3">👴</div>
          <p className="text-gray-600 font-medium mb-1">No patients added yet</p>
          <p className="text-sm text-gray-400 mb-4">
            Add your elderly family member to get started
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
          >
            + Add Patient
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {patients.map((patient) => (
            <div key={patient._id} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-xl">
                    {patient.gender === "female" ? "👵" : "👴"}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                    <div className="text-xs text-gray-400">{patient.age} yrs · {patient.gender}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(patient)}
                    className="text-xs text-teal-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(patient._id)}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-24">Mobility</span>
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                    {patient.mobilityStatus}
                  </span>
                </div>
                {patient.medicalConditions && (
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-gray-400 w-24">Conditions</span>
                    <span className="text-xs text-gray-600">{patient.medicalConditions}</span>
                  </div>
                )}
                {patient.specialRequirements && (
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-gray-400 w-24">Notes</span>
                    <span className="text-xs text-gray-600">{patient.specialRequirements}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}