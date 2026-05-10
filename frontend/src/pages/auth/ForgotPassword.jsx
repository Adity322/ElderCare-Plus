import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
        { email }
      )
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">

        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-semibold text-sm">
            E
          </div>
          <span className="text-lg font-medium text-gray-800">
            ElderCare<span className="text-teal-600">+</span>
          </span>
        </div>

        {success ? (
          <div className="text-center">
            <div className="text-5xl mb-4">📧</div>
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Check your email
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              We sent a password reset link to{" "}
              <span className="font-medium text-gray-700">{email}</span>.
              Check your inbox and click the link to reset your password.
            </p>
            <p className="text-xs text-gray-400 mb-6">
              The link expires in 1 hour. Check spam if you don't see it.
            </p>
            <Link
              to="/login"
              className="text-sm text-teal-600 hover:underline font-medium"
            >
              Back to login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-medium text-gray-800 mb-1">
              Forgot password?
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Enter your email and we'll send you a reset link
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium py-2.5 rounded-lg transition disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </form>

            <p className="text-sm text-gray-500 text-center mt-6">
              Remember your password?{" "}
              <Link to="/login" className="text-teal-600 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </>
        )}

      </div>
    </div>
  )
}