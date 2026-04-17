import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useApp } from '../store'

export default function Auth() {
  const { login, register, NHS_TRUSTS, DEPARTMENTS, GRADES, DEMO_USER } = useApp()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    trust: '',
    department: '',
    grade: '',
    gmc: '',
  })

  function set(k, v) {
    setForm(f => ({ ...f, [k]: v }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (mode === 'login') {
      const res = login(form.email, form.password)
      if (res.error) setError(res.error)
      else navigate('/dashboard')
    } else {
      if (!form.name || !form.email || !form.password || !form.trust || !form.department || !form.grade || !form.gmc) {
        setError('Please fill in all fields')
        setLoading(false)
        return
      }
      const res = register(form)
      if (res.error) setError(res.error)
      else navigate('/dashboard')
    }
    setLoading(false)
  }

  function demoLogin() {
    setForm({ email: DEMO_USER.email, password: DEMO_USER.password, name: '', trust: '', department: '', grade: '', gmc: '' })
    setMode('login')
    setError('')
    const res = login(DEMO_USER.email, DEMO_USER.password)
    if (!res.error) navigate('/dashboard')
  }

  const inputCls = 'w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-nhs-blue focus:border-transparent transition-shadow bg-white'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mini header */}
      <div className="p-4">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft size={15} /> Back to home
        </Link>
      </div>

      <div className="flex-1 flex items-start justify-center pt-6 pb-12 px-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-nhs-blue flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 stroke-white" strokeWidth="2.5">
                  <path d="M4 12 L12 4 L20 12 L12 20 Z" />
                  <circle cx="12" cy="12" r="2.5" fill="white" stroke="none"/>
                </svg>
              </div>
              <span className="font-heading font-bold text-gray-900 text-xl">
                Resident<span className="text-nhs-blue">Swaps</span>
              </span>
            </div>
            <h1 className="font-heading text-2xl font-bold text-gray-900">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {mode === 'login' ? 'Sign in to view your trust\'s swap board' : 'Join your NHS trust\'s swap community'}
            </p>
          </div>

          {/* Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            {['login', 'register'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError('') }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  mode === m ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {m === 'login' ? 'Sign in' : 'Register'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Full name</label>
                <input
                  type="text"
                  placeholder="Dr Jane Smith"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  className={inputCls}
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">NHS email</label>
              <input
                type="email"
                placeholder="jane.smith@nhs.net"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                className={inputCls}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder={mode === 'register' ? 'Choose a password' : 'Enter your password'}
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  className={`${inputCls} pr-10`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">NHS Trust</label>
                  <select
                    value={form.trust}
                    onChange={e => set('trust', e.target.value)}
                    className={inputCls}
                    required
                  >
                    <option value="">Select your trust…</option>
                    {NHS_TRUSTS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Department</label>
                    <select
                      value={form.department}
                      onChange={e => set('department', e.target.value)}
                      className={inputCls}
                      required
                    >
                      <option value="">Select…</option>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Grade</label>
                    <select
                      value={form.grade}
                      onChange={e => set('grade', e.target.value)}
                      className={inputCls}
                      required
                    >
                      <option value="">Select…</option>
                      {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">GMC number</label>
                  <input
                    type="text"
                    placeholder="7654321"
                    value={form.gmc}
                    onChange={e => set('gmc', e.target.value)}
                    className={inputCls}
                    maxLength={7}
                    pattern="\d{7}"
                    required
                  />
                </div>
              </>
            )}

            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-nhs-blue text-white font-semibold rounded-xl hover:bg-nhs-dark transition-colors disabled:opacity-60 mt-1"
            >
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </button>

            {mode === 'login' && (
              <button
                type="button"
                onClick={demoLogin}
                className="w-full py-3 border-2 border-dashed border-gray-200 text-gray-600 font-medium rounded-xl hover:border-nhs-blue hover:text-nhs-blue transition-colors text-sm"
              >
                ✨ Demo login — Dr Sarah Chen (IMT3, Cardiology)
              </button>
            )}
          </form>

          <p className="text-xs text-gray-400 text-center mt-6">
            By {mode === 'login' ? 'signing in' : 'registering'} you confirm you are an NHS doctor and agree to use ResidentSwaps only for legitimate shift swaps.
          </p>
        </div>
      </div>
    </div>
  )
}
