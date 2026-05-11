import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Nav — glassmorphism */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-[24px]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#000666] to-[#1a237e]">
              <span className="text-white font-bold text-sm">SC</span>
            </div>
            <span className="font-heading font-bold text-lg" style={{ color: '#1a1c1c' }}>SecureCustodian</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="#features" className="text-sm" style={{ color: '#454652' }}>Features</Link>
            <Link href="#how" className="text-sm" style={{ color: '#454652' }}>How it works</Link>
            <Link href="/login" className="text-sm font-medium" style={{ color: '#1a237e' }}>Sign in</Link>
            <Link
              href="/login"
              className="text-sm font-semibold px-6 py-2.5 rounded-xl text-white"
              style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-6 pt-32 pb-24" style={{ background: '#f9f9f9' }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full mb-6" style={{ background: '#eeeeee', color: '#1a237e' }}>
            <span className="w-2 h-2 rounded-full" style={{ background: '#22c55e' }} />
            Trusted by 500+ stores worldwide
          </div>
          <h1 className="font-heading text-5xl md:text-6xl font-extrabold leading-tight mb-6" style={{ color: '#1a1c1c' }}>
            Store your luggage{'\n'}
            <span style={{ color: '#ff6d00' }}>safely, anywhere.</span>
          </h1>
          <p className="text-lg max-w-xl mx-auto mb-10 leading-relaxed" style={{ color: '#454652' }}>
            Find verified stores near you to leave your bags for a few hours or several days. Insured, secure, and affordable.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/login"
              className="font-semibold px-8 py-3.5 rounded-xl text-white text-base"
              style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}
            >
              Start Storing
            </Link>
            <Link
              href="#how"
              className="font-semibold px-8 py-3.5 rounded-xl text-base"
              style={{ background: '#eeeeee', color: '#1a1c1c' }}
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6" style={{ background: '#ffffff' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-center mb-4" style={{ color: '#1a1c1c' }}>Why SecureCustodian?</h2>
          <p className="text-center mb-16 max-w-lg mx-auto" style={{ color: '#454652' }}>
            Everything you need for hassle-free luggage storage.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Insured & Secure', desc: 'Every booking is protected up to $2,500. Your items are safe with us.', icon: '🛡️' },
              { title: 'Real-time Availability', desc: 'See live capacity and book instantly. No waiting for confirmation.', icon: '⚡' },
              { title: 'Flexible Duration', desc: 'Store for a few hours or several days. Pay only for what you use.', icon: '⏰' },
              { title: 'Verified Locations', desc: 'All stores are vetted and reviewed by real travelers like you.', icon: '✅' },
              { title: 'Easy Check-in/out', desc: 'Show your QR code and you\'re done. No paperwork, no hassle.', icon: '📱' },
              { title: '24/7 Support', desc: 'Our team is always available to help with any issues.', icon: '💬' },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl p-8 shadow-[0px_20px_40px_rgba(26,35,126,0.06)]"
                style={{ background: '#ffffff' }}
              >
                <span className="text-3xl mb-4 block">{f.icon}</span>
                <h3 className="font-heading font-bold text-lg mb-2" style={{ color: '#1a1c1c' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#454652' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 px-6" style={{ background: '#f9f9f9' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-center mb-4" style={{ color: '#1a1c1c' }}>How it works</h2>
          <p className="text-center mb-16 max-w-lg mx-auto" style={{ color: '#454652' }}>Three simple steps to store your luggage.</p>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: '01', title: 'Find a store', desc: 'Search for stores near you, check prices and availability.' },
              { step: '02', title: 'Book & Pay', desc: 'Select your dates, choose your bags, and pay securely.' },
              { step: '03', title: 'Drop & Go', desc: 'Show your QR code at the store. Your luggage is safe.' },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-6 text-white"
                  style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}
                >
                  {s.step}
                </div>
                <h3 className="font-heading font-bold text-lg mb-2" style={{ color: '#1a1c1c' }}>{s.title}</h3>
                <p className="text-sm" style={{ color: '#454652' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6" style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-3xl font-bold text-white mb-4">Ready to travel light?</h2>
          <p className="text-white/70 mb-10 max-w-md mx-auto">Join thousands of travelers who store their luggage with us every day.</p>
          <Link
            href="/login"
            className="font-semibold px-8 py-3.5 rounded-xl text-base text-white"
            style={{ background: '#ff6d00' }}
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6" style={{ background: '#ffffff' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm" style={{ color: '#454652' }}>
          <span>© 2026 SecureCustodian. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="#" className="hover:opacity-70">Terms</Link>
            <Link href="#" className="hover:opacity-70">Privacy</Link>
            <Link href="/login" className="hover:opacity-70">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
