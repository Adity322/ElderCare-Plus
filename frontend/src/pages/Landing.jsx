import { Link } from "react-router-dom"

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-semibold text-sm">
            E
          </div>
          <span className="text-lg font-medium text-gray-800">
            ElderCare<span className="text-teal-600">+</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm text-gray-600 hover:text-teal-600 font-medium transition"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="text-sm bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-8 py-20 max-w-5xl mx-auto text-center">
        <span className="inline-block bg-teal-50 text-teal-700 text-xs font-medium px-3 py-1 rounded-full mb-6">
          Trusted Home Healthcare Platform
        </span>
        <h1 className="text-4xl md:text-5xl font-medium text-gray-900 leading-tight mb-6">
          Quality care for your<br />
          <span className="text-teal-600">elderly loved ones</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto mb-10">
          Connect with verified nurses, caregivers, and physiotherapists
          for professional in-home elderly care — anytime, anywhere.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/register"
            className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-6 py-3 rounded-lg transition"
          >
            Find a caregiver
          </Link>
          <Link
            to="/register"
            className="border border-gray-200 hover:border-teal-400 text-gray-700 text-sm font-medium px-6 py-3 rounded-lg transition"
          >
            Join as caregiver
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto">
          <div>
            <div className="text-2xl font-medium text-gray-900">500+</div>
            <div className="text-sm text-gray-500 mt-1">Verified caregivers</div>
          </div>
          <div>
            <div className="text-2xl font-medium text-gray-900">2,000+</div>
            <div className="text-sm text-gray-500 mt-1">Families served</div>
          </div>
          <div>
            <div className="text-2xl font-medium text-gray-900">4.8★</div>
            <div className="text-sm text-gray-500 mt-1">Average rating</div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-gray-50 px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-medium text-gray-900 text-center mb-2">
            Our services
          </h2>
          <p className="text-gray-500 text-sm text-center mb-10">
            Professional care tailored to every need
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "🩺", title: "Nursing Care", desc: "Wound dressing, medication, vitals monitoring" },
              { icon: "🧑‍⚕️", title: "Elderly Attendant", desc: "Personal hygiene, mobility, companionship" },
              { icon: "🏃", title: "Physiotherapy", desc: "Rehabilitation, exercises, pain management" },
              { icon: "🏥", title: "Post-Hospital Care", desc: "Recovery monitoring and follow-up care" },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="text-3xl mb-3">{s.icon}</div>
                <div className="text-sm font-medium text-gray-800 mb-1">{s.title}</div>
                <div className="text-xs text-gray-500">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-8 py-16 max-w-5xl mx-auto">
        <h2 className="text-2xl font-medium text-gray-900 text-center mb-2">
          How it works
        </h2>
        <p className="text-gray-500 text-sm text-center mb-10">
          Get started in 3 simple steps
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Create your profile", desc: "Register and add your elderly family member's medical details and care requirements." },
            { step: "02", title: "Browse & book", desc: "Filter verified caregivers by service, location, availability and rating. Book instantly." },
            { step: "03", title: "Track & review", desc: "Monitor care in real time, read care notes after each session, and rate your caregiver." },
          ].map((s, i) => (
            <div key={i} className="flex gap-4">
              <div className="text-3xl font-medium text-teal-100">{s.step}</div>
              <div>
                <div className="text-sm font-medium text-gray-800 mb-1">{s.title}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-teal-600 px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-medium text-white text-center mb-10">
            Why families trust ElderCare+
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "✅", title: "Verified caregivers", desc: "Every caregiver is document-verified by our admin team" },
              { icon: "📍", title: "Real-time tracking", desc: "Live status updates during every care session" },
              { icon: "⭐", title: "Rated & reviewed", desc: "Transparent ratings from real families after every booking" },
              { icon: "🔒", title: "Secure & private", desc: "Patient data is encrypted and role-protected at all times" },
            ].map((w, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl mb-3">{w.icon}</div>
                <div className="text-sm font-medium text-white mb-1">{w.title}</div>
                <div className="text-xs text-teal-100">{w.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-16 text-center">
        <h2 className="text-2xl font-medium text-gray-900 mb-3">
          Ready to get started?
        </h2>
        <p className="text-gray-500 text-sm mb-8">
          Join thousands of families who trust ElderCare+ for their loved ones
        </p>
        <Link
          to="/register"
          className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-8 py-3 rounded-lg transition"
        >
          Create free account
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-8 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-teal-600 flex items-center justify-center text-white text-xs font-medium">
              E
            </div>
            <span className="text-sm text-gray-600">
              ElderCare<span className="text-teal-600">+</span>
            </span>
          </div>
          <div className="text-xs text-gray-400">
            © 2026 ElderCare+. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  )
}