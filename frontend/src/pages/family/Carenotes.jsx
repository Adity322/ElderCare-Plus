import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../../context/AuthContext"

export default function CareNotes() {
  const { token } = useAuth()
  const [bookings, setBookings] = useState([])
  const [notes, setNotes] = useState({})
  const [loading, setLoading] = useState(true)
  const [expandedBooking, setExpandedBooking] = useState(null)
  const [review, setReview] = useState({ rating: 5, comment: "" })
  const [reviewedBookings, setReviewedBookings] = useState([])
  const [submittingReview, setSubmittingReview] = useState(null)

  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/bookings`,
          { headers }
        )
        const completed = res.data.filter((b) => b.status === "completed")
        setBookings(completed)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  const fetchNotes = async (bookingId) => {
    if (notes[bookingId]) {
      setExpandedBooking(
        expandedBooking === bookingId ? null : bookingId
      )
      return
    }
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/bookings/${bookingId}/notes`,
        { headers }
      )
      setNotes((prev) => ({ ...prev, [bookingId]: res.data }))
      setExpandedBooking(bookingId)
    } catch (err) {
      console.error(err)
    }
  }

  const handleReviewSubmit = async (bookingId) => {
    setSubmittingReview(bookingId)
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/bookings/${bookingId}/review`,
        review,
        { headers }
      )
      setReviewedBookings((prev) => [...prev, bookingId])
      setReview({ rating: 5, comment: "" })
    } catch (err) {
      console.error(err)
    } finally {
      setSubmittingReview(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">Loading care notes...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-medium text-gray-900">Care Notes</h1>
        <p className="text-sm text-gray-500 mt-1">
          View session notes and rate your caregivers
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-gray-600 font-medium mb-1">No completed sessions yet</p>
          <p className="text-sm text-gray-400">
            Care notes will appear here after a session is completed
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            >
              {/* Booking Header */}
              <div
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => fetchNotes(booking._id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-lg">
                    🧑‍⚕️
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {booking.serviceType}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {booking.caregiverId?.userId?.name || "Caregiver"} ·{" "}
                      {new Date(booking.startDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-full">
                    {booking.patientId?.name}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {expandedBooking === booking._id ? "▲" : "▼"}
                  </span>
                </div>
              </div>

              {/* Expanded Notes */}
              {expandedBooking === booking._id && (
                <div className="border-t border-gray-100 p-5 space-y-4">

                  {/* Care Notes */}
                  {notes[booking._id]?.length === 0 ? (
                    <div className="text-center py-6">
                      <div className="text-2xl mb-2">📝</div>
                      <p className="text-sm text-gray-400">
                        No care notes added for this session yet
                      </p>
                    </div>
                  ) : (
                    notes[booking._id]?.map((note) => (
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
                            <div className="text-xs text-gray-400 mb-1">Activities Performed</div>
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
                    ))
                  )}

                  {/* Review Section */}
                  {!reviewedBookings.includes(booking._id) ? (
                    <div className="border border-gray-100 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-800 mb-3">
                        Rate this caregiver
                      </div>

                      {/* Star Rating */}
                      <div className="flex gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() =>
                              setReview((r) => ({ ...r, rating: star }))
                            }
                            className={`text-2xl transition ${
                              star <= review.rating
                                ? "text-amber-400"
                                : "text-gray-200"
                            }`}
                          >
                            ★
                          </button>
                        ))}
                        <span className="text-sm text-gray-400 ml-2 self-center">
                          {review.rating}/5
                        </span>
                      </div>

                      <textarea
                        value={review.comment}
                        onChange={(e) =>
                          setReview((r) => ({ ...r, comment: e.target.value }))
                        }
                        rows={3}
                        placeholder="Share your experience with this caregiver..."
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none mb-3"
                      />

                      <button
                        onClick={() => handleReviewSubmit(booking._id)}
                        disabled={submittingReview === booking._id}
                        className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition disabled:opacity-60"
                      >
                        {submittingReview === booking._id
                          ? "Submitting..."
                          : "Submit Review"}
                      </button>
                    </div>
                  ) : (
                    <div className="bg-teal-50 text-teal-700 text-sm px-4 py-3 rounded-lg text-center">
                      ✅ Review submitted successfully
                    </div>
                  )}

                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  )
}