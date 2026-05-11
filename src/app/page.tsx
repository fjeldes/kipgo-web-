import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Nav */}
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SC</span>
            </div>
            <span className="font-bold text-lg text-blue-900">SecureCustodian</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="#features" className="text-sm text-gray-600 hover:text-blue-900">Features</Link>
            <Link href="#how" className="text-sm text-gray-600 hover:text-blue-900">How it works</Link>
            <Link href="/login" className="text-sm font-medium text-blue-900 hover:text-blue-700">Sign in</Link>
            <Link href="/login" className="bg-blue-900 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-blue-800 transition">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-900 text-xs font-semibold px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            Trusted by 500+ stores worldwide
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-blue-900 leading-tight mb-6">
            Store your luggage{'\n'}
            <span className="text-orange-500">safely, anywhere.</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
            Find verified stores near you to leave your bags for a few hours or several days. Insured, secure, and affordable.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/login" className="bg-blue-900 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-800 transition text-base">
              Start Storing
            </Link>
            <Link href="#how" className="border border-gray-200 text-gray-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-gray-50 transition text-base">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-4">Why SecureCustodian?</h2>
          <p className="text-gray-500 text-center mb-16 max-w-lg mx-auto">
            Everything you need for hassle-free luggage storage.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Insured & Secure', desc: 'Every booking is protected up to $2,500. Your items are safe with us.', icon: '🛡️' },
              { title: 'Real-time Availability', desc: 'See live capacity and book instantly. No waiting for confirmation.', icon: '⚡' },
              { title: 'Flexible Duration', desc: 'Store for a few hours or several days. Pay only for what you use.', icon: '⏰' },
              { title: 'Verified Locations', desc: 'All stores are vetted and reviewed by real travelers like you.', icon: '✅' },
              { title: 'Easy Check-in/out', desc: 'Show your QR code and you\'re done. No paperwork, no hassle.', icon: '📱' },
              { title: '24/7 Support', desc: 'Our team is always available to help with any issues.', icon: '💬' },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <span className="text-3xl mb-4 block">{f.icon}</span>
                <h3 className="font-bold text-blue-900 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-4">How it works</h2>
          <p className="text-gray-500 text-center mb-16 max-w-lg mx-auto">Three simple steps to store your luggage.</p>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: '01', title: 'Find a store', desc: 'Search for stores near you, check prices and availability.' },
              { step: '02', title: 'Book & Pay', desc: 'Select your dates, choose your bags, and pay securely.' },
              { step: '03', title: 'Drop & Go', desc: 'Show your QR code at the store. Your luggage is safe.' },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-16 h-16 bg-blue-900 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-6">
                  {s.step}
                </div>
                <h3 className="font-bold text-blue-900 text-lg mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-900">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to travel light?</h2>
          <p className="text-blue-200 mb-10 max-w-md mx-auto">Join thousands of travelers who store their luggage with us every day.</p>
          <Link href="/login" className="bg-orange-500 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-orange-600 transition text-base">
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-sm text-gray-400">
          <span>© 2026 SecureCustodian. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-gray-600">Terms</Link>
            <Link href="#" className="hover:text-gray-600">Privacy</Link>
            <Link href="/login" className="hover:text-gray-600">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
