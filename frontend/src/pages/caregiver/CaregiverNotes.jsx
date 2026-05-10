import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../../context/AuthContext"

const emptyNote = {
  noteText: "",
  activities: "",
  observations: "",
  nextRecommendations: "",
}

export default function CaregiverNotes() {
  const { token } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [notes, setNotes] = useState({})
  const [form, setForm] = useState(emptyNote)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/bookings`,
          { headers }
        )
        const relevant = res.data.filter(
          (b) => b.status === "in-progress" || b.status === "completed"
        )
        setBookings(relevant)

        // check for bookingId in URL query param
        const params = new URLSearchParams(window.location.search)
        const bookingId = params.get("bookingId")
        if (bookingId) {
          const found = relevant.find((b) => b._id === bookingId)
          if (found) {
            setSelectedBooking(found)
            fetchNotes(bookingId)
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  const fetchNotes = async (bookingId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/bookings/${bookingId}/notes`,
        { headers }
      )
      setNotes((prev) => ({ ...prev, [bookingId]: res.data }))
    } catch (err) {
      console.error(err)
    }
  }

  const handleSelectBooking = (booking) => {
    setSelectedBooking(booking)
    setForm(emptyNote)
    setSuccess("")
    setError("")
    if (!notes[booking._id]) {
      fetchNotes(booking._id)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    setSuccess("")
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/bookings/${selectedBooking._id}/notes`,
        form,
        { headers }
      )
      setSuccess("Care note added successfully")
      setForm(emptyNote)
      fetchNotes(selectedBooking._id)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add note")
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

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-medium text-gray-900">Care Notes</h1>
        <p className="text-sm text-gray-500 mt-1">
          Log session notes for your patients
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-gray-600 font-medium mb-1">No sessions found</p>
          <p className="text-sm text-gray-400">
            Start a session first to add care notes
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Booking List */}
          <div className="space-y-3">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Select Session
            </div>
            {bookings.map((booking) => (
              <div
                key={booking._id}
                onClick={() => handleSelectBooking(booking)}
                className={`p-4 rounded-xl border cursor-pointer transition
                  ${selectedBooking?._id === booking._id
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-100 bg-white hover:border-blue-200"
                  }`}
              >
                <div className="text-sm font-medium text-gray-900">
                  {booking.serviceType}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {booking.patientId?.name} · {new Date(booking.startDate).toLocaleDateString()}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                    ${booking.status === "in-progress"
                      ? "bg-teal-50 text-teal-700"
                      : "bg-gray-50 text-gray-600"
                    }`}>
                    {booking.status === "in-progress" ? "In Progress" : "Completed"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {notes[booking._id]?.length || 0} notes
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Notes Panel */}
          <div className="md:col-span-2 space-y-4">
            {!selectedBooking ? (
              <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                <div className="text-4xl mb-3">👈</div>
                <p className="text-sm text-gray-400">
                  Select a session to view or add notes
                </p>
              </div>
            ) : (
              <>
                {/* Add Note Form */}
                {selectedBooking.status === "in-progress" && (
                  <div className="bg-white rounded-xl border border-gray-100 p-5">
                    <h2 className="text-sm font-medium text-gray-800 mb-4">
                      Add Care Note
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
                          Session Note
                        </label>
                        <textarea
                          name="noteText"
                          value={form.noteText}
                          onChange={handleChange}
                          required
                          rows={3}
                          placeholder="General notes about this session..."
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">
                          Activities Performed
                        </label>
                        <textarea
                          name="activities"
                          value={form.activities}
                          onChange={handleChange}
                          rows={2}
                          placeholder="e.g. Wound dressing, medication given, vitals checked..."
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">
                          Observations
                        </label>
                        <textarea
                          name="observations"
                          value={form.observations}
                          onChange={handleChange}
                          rows={2}
                          placeholder="e.g. Patient was cooperative, BP was 120/80..."
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">
                          Next Recommendations
                        </label>
                        <textarea
                          name="nextRecommendations"
                          value={form.nextRecommendations}
                          onChange={handleChange}
                          rows={2}
                          placeholder="e.g. Continue medication, follow up in 2 days..."
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg transition disabled:opacity-60"
                      >
                        {submitting ? "Saving..." : "Save Care Note"}
                      </button>
                    </form>
                  </div>
                )}

                {/* Previous Notes */}
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                  <h2 className="text-sm font-medium text-gray-800 mb-4">
                    Previous Notes
                    {notes[selectedBooking._id]?.length > 0 && (
                      <span className="ml-2 bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                        {notes[selectedBooking._id].length}
                      </span>
                    )}
                  </h2>

                  {!notes[selectedBooking._id] || notes[selectedBooking._id].length === 0 ? (
                    <div className="text-center py-6">
                      <div className="text-2xl mb-2">📝</div>
                      <p className="text-sm text-gray-400">No notes added yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {notes[selectedBooking._id].map((note) => (
                        <div
                          key={note._id}
                          className="bg-gray-50 rounded-lg p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-700">
                              Session Note
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(note.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {note.noteText && (
                            <div>
                              <div className="text-xs text-gray-400 mb-1">Note</div>
                              <div className="text-sm text-gray-700">{note.noteText}</div>
                            </div>
                          )}

                          {note.activities && (
                            <div>
                              <div className="text-xs text-gray-400 mb-1">Activities</div>
                              <div className="text-sm text-gray-700">{note.activities}</div>
                            </div>
                          )}

                          {note.observations && (
                            <div>
                              <div className="text-xs text-gray-400 mb-1">Observations</div>
                              <div className="text-sm text-gray-700">{note.observations}</div>
                            </div>
                          )}

                          {note.nextRecommendations && (
                            <div>
                              <div className="text-xs text-gray-400 mb-1">Next Recommendations</div>
                              <div className="text-sm text-gray-700 bg-teal-50 text-teal-800 p-2 rounded-lg">
                                {note.nextRecommendations}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

        </div>
      )}

    </div>
  )
}