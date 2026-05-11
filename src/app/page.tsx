import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 w-full z-40 bg-slate-50/80 backdrop-blur-xl shadow-sm">
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl font-heading font-black tracking-tighter" style={{ color: '#000666', fontVariationSettings: "'FILL' 1" }}>
              shield
            </span>
            <span className="font-heading font-black tracking-tighter text-2xl" style={{ color: '#000666' }}>Secure Custodian</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a className="font-body font-medium hover:opacity-70 transition-colors" style={{ color: '#454652' }} href="#how">How it Works</a>
            <a className="font-body font-medium hover:opacity-70 transition-colors" style={{ color: '#454652' }} href="#safety">Safety</a>
            <a className="font-body font-medium hover:opacity-70 transition-colors" style={{ color: '#454652' }} href="#pricing">Pricing</a>
            <a className="font-body font-medium hover:opacity-70 transition-colors" style={{ color: '#454652' }} href="#partners">Partners</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="px-5 py-2 font-bold hover:bg-slate-100 rounded-xl transition-colors active:scale-95" style={{ color: '#000666' }}>Login</Link>
            <Link href="/login" className="px-6 py-2.5 rounded-xl font-bold diffusion-shadow active:scale-95 transition-transform text-white" style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}>
              Download App
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-24 px-6 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="z-10">
              <span className="inline-block py-1 px-3 rounded-full text-xs font-bold uppercase tracking-widest mb-6" style={{ background: '#ffdbcb', color: '#341100' }}>
                World-Class Custody
              </span>
              <h1 className="text-6xl md:text-7xl font-heading font-extrabold leading-[1.1] tracking-tight mb-8" style={{ color: '#1a1c1c' }}>
                Your luggage, <span className="italic" style={{ color: '#000666' }}>safe</span> anywhere
              </h1>
              <p className="text-lg max-w-xl mb-10 leading-relaxed" style={{ color: '#454652' }}>
                Free yourself from the weight and enjoy the city. We offer a global network of verified storage points with bank-grade security for your belongings.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/login" className="px-8 py-4 rounded-xl font-bold text-lg diffusion-shadow hover:brightness-110 transition-all flex items-center gap-2 text-white" style={{ background: '#fd6c00' }}>
                  <span className="material-symbols-outlined">search</span>
                  Find a location
                </Link>
                <Link href="#how" className="px-8 py-4 rounded-xl font-bold text-lg hover:opacity-70 transition-colors flex items-center gap-2" style={{ background: '#eeeeee', color: '#000666' }}>
                  <span className="material-symbols-outlined">play_circle</span>
                  See how it works
                </Link>
              </div>
              <div className="mt-12 flex items-center gap-6">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-blue-600" />
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-purple-400 to-purple-600" />
                  <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold" style={{ background: '#1a237e' }}>
                    +24k
                  </div>
                </div>
                <p className="text-sm font-medium italic" style={{ color: '#454652' }}>Users trust us every day</p>
              </div>
            </div>
            <div className="relative lg:h-[600px]">
              <div className="absolute inset-0 rounded-[2rem] -rotate-3 translate-x-4" style={{ background: '#e0e0ff' }} />
              <div className="relative h-full w-full rounded-[2rem] overflow-hidden shadow-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <div className="text-center p-12">
                  <span className="text-8xl">👜</span>
                  <p className="mt-4 text-lg font-semibold" style={{ color: '#000666' }}>Secure Storage</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section id="how" className="py-24 px-6" style={{ background: '#f3f3f3' }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-heading font-bold mb-4" style={{ color: '#1a1c1c' }}>Simplicity in three steps</h2>
              <p className="max-w-2xl mx-auto" style={{ color: '#454652' }}>Our process is designed so you forget about your luggage in less than two minutes. Absolute efficiency for the modern traveler.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: 'location_on', title: 'Search', desc: 'Find the nearest storage point to your current location or final destination among thousands of verified partners.', iconBg: '#e0e0ff', iconColor: '#000666' },
                { icon: 'event_available', title: 'Book', desc: 'Select the time and number of items. Pay securely through our encrypted platform.', iconBg: '#ffdbcb', iconColor: '#9f4200' },
                { icon: 'verified_user', title: 'Store', desc: 'Hand over your belongings, receive your armored QR validation and enjoy your freedom without worries.', iconBg: '#e0e0ff', iconColor: '#000666' },
              ].map((s) => (
                <div key={s.title} className="bg-white p-8 rounded-[2rem] shadow-[0px_20px_40px_rgba(26,35,126,0.06)] transition-transform hover:-translate-y-2">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: s.iconBg }}>
                    <span className="material-symbols-outlined text-3xl" style={{ color: s.iconColor }}>{s.icon}</span>
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-4" style={{ color: '#1a1c1c' }}>{s.title}</h3>
                  <p className="leading-relaxed" style={{ color: '#454652' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section id="safety" className="py-24 px-6" style={{ background: '#1a237e' }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-end justify-between mb-16 gap-8">
              <div className="max-w-2xl">
                <span className="font-bold uppercase tracking-[0.2em] text-xs mb-4 block" style={{ color: '#8690ee' }}>Unshakeable Security</span>
                <h2 className="text-4xl md:text-5xl font-heading font-extrabold leading-tight text-white">Your trust is our most valuable asset</h2>
              </div>
              <Link href="/login" className="px-8 py-4 bg-white rounded-xl font-bold hover:opacity-90 transition-colors" style={{ color: '#000666' }}>
                Security Certifications
              </Link>
            </div>
            <div className="grid md:grid-cols-3 rounded-[2rem] overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
              {[
                { icon: 'health_and_safety', title: 'Multi-risk Insurance', desc: 'Each booking includes coverage up to $3,000 against theft, loss or accidental damage.' },
                { icon: 'nest_cam_outdoor', title: 'CCTV Monitoring', desc: 'Points equipped with 24/7 surveillance and permanently audited restricted access.' },
                { icon: 'qr_code_scanner', title: 'Armored QR Validation', desc: 'Only you can retrieve your belongings using a unique dynamic code generated in your app.' },
              ].map((s) => (
                <div key={s.title} className="p-12 flex flex-col items-center text-center" style={{ background: '#1a237e' }}>
                  <span className="material-symbols-outlined text-6xl mb-8" style={{ color: '#8690ee', fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                  <h3 className="text-2xl font-heading font-bold mb-4 text-white">{s.title}</h3>
                  <p className="leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partner Section */}
        <section id="partners" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="bg-white rounded-[3rem] overflow-hidden flex flex-col lg:flex-row shadow-[0px_20px_40px_rgba(26,35,126,0.06)]">
            <div className="p-12 lg:p-20 lg:w-1/2 flex flex-col justify-center">
              <h2 className="text-4xl font-heading font-extrabold mb-8 leading-tight" style={{ color: '#1a1c1c' }}>Turn your unused space into income</h2>
              <ul className="space-y-6 mb-12">
                {[
                  { icon: 'payments', title: 'Monthly Income', desc: 'Generate recurring benefits using idle space in your premises or warehouse.' },
                  { icon: 'group', title: 'Customer Flow', desc: 'Attract new potential customers to your physical establishment for free.' },
                  { icon: 'support_agent', title: '24/7 Support', desc: 'Dedicated team to assist you in managing and resolving any questions.' },
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-4">
                    <span className="material-symbols-outlined p-1 rounded-lg flex-shrink-0" style={{ background: '#ffdbcb', color: '#9f4200' }}>{item.icon}</span>
                    <div>
                      <strong className="block text-lg" style={{ color: '#1a1c1c' }}>{item.title}</strong>
                      <p style={{ color: '#454652' }}>{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Link href="/login" className="px-10 py-5 rounded-2xl font-bold text-xl hover:brightness-110 transition-all self-start active:scale-95 text-white" style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}>
                Become a Partner
              </Link>
            </div>
            <div className="lg:w-1/2 min-h-[400px] bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center relative">
              <div className="text-center p-12">
                <span className="text-8xl">🏪</span>
                <p className="mt-4 text-lg font-semibold" style={{ color: '#000666' }}>Your Store, Extra Income</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="pt-20 pb-12 px-6" style={{ background: '#e8e8e8' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-2xl" style={{ color: '#000666', fontVariationSettings: "'FILL' 1" }}>shield</span>
                <span className="font-heading font-black tracking-tighter text-xl" style={{ color: '#000666' }}>Secure Custodian</span>
              </div>
              <p className="mb-8 max-w-xs leading-relaxed" style={{ color: '#454652' }}>Redefining urban mobility through intelligent and secure custody.</p>
              <div className="flex gap-4">
                {['public', 'share', 'mail'].map((icon) => (
                  <Link key={icon} href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-colors" style={{ background: '#e2e2e2', color: '#000666' }}>
                    <span className="material-symbols-outlined text-xl">{icon}</span>
                  </Link>
                ))}
              </div>
            </div>
            {[
              { title: 'Company', items: ['About Us', 'Careers', 'Press', 'Blog'] },
              { title: 'Support', items: ['Help Center', 'Safety', 'Contact', 'Drop-off Points'] },
              { title: 'Legal', items: ['Privacy', 'Terms', 'Cookies', 'Insurance'] },
              { title: 'Apps', items: ['iOS App', 'Android App', 'Partners Web'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-bold mb-6" style={{ color: '#1a1c1c' }}>{col.title}</h4>
                <ul className="space-y-4 text-sm font-medium" style={{ color: '#454652' }}>
                  {col.items.map((item) => (
                    <li key={item}><a href="#" className="hover:opacity-70 transition-colors">{item}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-6" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            <p className="text-sm" style={{ color: '#454652' }}>© 2026 SecureCustodian. All rights reserved.</p>
            <div className="flex items-center gap-8 text-xs font-bold uppercase tracking-widest" style={{ color: '#454652' }}>
              <span className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> System Online</span>
              <span className="flex items-center gap-2">AES-256 Protocol</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
