import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Shield, Users, Bell, CheckCircle } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Post in seconds',
    desc: 'List your shift in under a minute. Choose type, date, and what you want in return.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Shield,
    title: 'Trust-verified',
    desc: 'Only doctors at your NHS trust see your listing. Your GMC number stays private.',
    color: 'bg-blue-50 text-nhs-blue',
  },
  {
    icon: Users,
    title: 'Instant matching',
    desc: 'See all open swaps from colleagues at your trust, filtered by shift type or department.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Bell,
    title: 'Urgent alerts',
    desc: 'Flag your swap as urgent so colleagues see it first when they log in.',
    color: 'bg-rose-50 text-rose-600',
  },
]

const steps = [
  { n: '01', title: 'Create your account', desc: 'Register with your NHS email, trust, and grade. Takes 60 seconds.' },
  { n: '02', title: 'Post your shift', desc: 'Choose the shift you\'re offering and specify what you\'d like in return.' },
  { n: '03', title: 'Connect with a colleague', desc: 'Message doctors who respond, agree the swap, and update your rota.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top nav */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-nhs-blue flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 stroke-white" strokeWidth="2.5">
                <path d="M4 12 L12 4 L20 12 L12 20 Z" />
                <circle cx="12" cy="12" r="2.5" fill="white" stroke="none"/>
              </svg>
            </div>
            <span className="font-heading font-bold text-gray-900 text-lg">
              Resident<span className="text-nhs-blue">Swaps</span>
            </span>
          </div>
          <Link
            to="/auth"
            className="px-4 py-2 bg-nhs-blue text-white text-sm font-medium rounded-lg hover:bg-nhs-dark transition-colors"
          >
            Sign in
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-24 px-4 sm:px-6 text-center bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-nhs-blue text-xs font-semibold rounded-full mb-6 tracking-wide uppercase">
            Built for NHS junior doctors
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Swap shifts without<br className="hidden sm:block" /> the hassle.
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
            Find colleagues in your trust who need a swap. Post your shift, set what you want in return, and sort it in minutes — no more WhatsApp chains.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/auth"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-nhs-blue text-white font-semibold rounded-xl hover:bg-nhs-dark transition-all shadow-sm hover:shadow-md"
            >
              Get started <ArrowRight size={16} />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center px-6 py-3.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              How it works
            </a>
          </div>
        </div>

        {/* Hero mock card */}
        <div className="mt-16 max-w-sm mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 text-left">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-heading font-semibold text-gray-900 text-sm">Dr James Okafor</p>
                <p className="text-xs text-gray-400">IMT2 · Respiratory Medicine</p>
              </div>
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">Night</span>
            </div>
            <div className="space-y-1.5 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Offering</span>
                <span className="font-medium text-gray-900">Night · Tue 22 Apr</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Wants</span>
                <span className="font-medium text-gray-900">Day shift</span>
              </div>
            </div>
            <button className="w-full py-2 bg-nhs-blue text-white text-sm font-semibold rounded-lg">
              Offer swap
            </button>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-gray-900 text-center mb-12">
            Why doctors use ResidentSwaps
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                  <Icon size={20} />
                </div>
                <h3 className="font-heading font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-gray-900 text-center mb-14">
            Three steps to a sorted rota
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(({ n, title, desc }) => (
              <div key={n} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-nhs-blue text-white flex items-center justify-center font-heading font-bold text-lg mx-auto mb-5">
                  {n}
                </div>
                <h3 className="font-heading font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA block */}
      <section className="bg-nhs-dark py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to simplify your swaps?
          </h2>
          <p className="text-blue-200 mb-8 text-lg">
            Join hundreds of NHS doctors who've ditched the group chats.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/auth"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-nhs-blue font-semibold rounded-xl hover:bg-blue-50 transition-colors"
            >
              Create free account <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {['No subscription fee', 'NHS email required', 'Trust-private listings'].map(t => (
              <span key={t} className="flex items-center gap-1.5 text-blue-200 text-sm">
                <CheckCircle size={14} className="text-blue-400" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-nhs-dark border-t border-blue-900 py-6 px-4 text-center text-blue-400 text-sm">
        © 2026 ResidentSwaps · Made for NHS junior doctors · Not affiliated with NHS England
      </footer>
    </div>
  )
}
