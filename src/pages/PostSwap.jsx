import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react'
import { useApp } from '../store'

const SHIFT_COLORS = {
  'day': 'border-amber-300 bg-amber-50 text-amber-700',
  'long-day': 'border-orange-300 bg-orange-50 text-orange-700',
  'night': 'border-indigo-300 bg-indigo-50 text-indigo-700',
  'twilight': 'border-purple-300 bg-purple-50 text-purple-700',
  'weekend-day': 'border-emerald-300 bg-emerald-50 text-emerald-700',
  'weekend-night': 'border-rose-300 bg-rose-50 text-rose-700',
  'on-call': 'border-sky-300 bg-sky-50 text-sky-700',
}

function ShiftCard({ shift, selected, onSelect }) {
  const cls = selected
    ? `${SHIFT_COLORS[shift.id]} border-2 shadow-sm`
    : 'border-2 border-gray-100 bg-white text-gray-700 hover:border-gray-300'

  return (
    <button
      type="button"
      onClick={() => onSelect(shift.id)}
      className={`relative flex flex-col items-start p-4 rounded-xl transition-all text-left w-full ${cls}`}
    >
      {selected && (
        <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-current opacity-20 flex items-center justify-center">
          <Check size={11} className="relative z-10 opacity-100 text-current" style={{ opacity: 1 }} />
        </span>
      )}
      {selected && <Check size={14} className="absolute top-3 right-3" />}
      <span className="font-heading font-semibold text-sm mb-0.5">{shift.label}</span>
      <span className="text-xs opacity-70">{shift.time}</span>
    </button>
  )
}

export default function PostSwap() {
  const { SHIFT_TYPES, addSwap } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)
  const [newSwap, setNewSwap] = useState(null)

  const [form, setForm] = useState({
    offerType: '',
    offerDate: '',
    wantType: '',
    wantDate: '',
    note: '',
    urgent: false,
  })

  function set(k, v) {
    setForm(f => ({ ...f, [k]: v }))
  }

  function selectOfferType(id) {
    const shift = SHIFT_TYPES.find(s => s.id === id)
    set('offerType', id)
  }

  function canNext() {
    return form.offerType && form.offerDate
  }

  function canSubmit() {
    return form.wantType
  }

  function submit() {
    const swap = addSwap(form)
    setNewSwap(swap)
    setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm w-full">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <Check size={28} className="text-emerald-600" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">Swap posted!</h2>
          <p className="text-gray-500 mb-8">
            Your listing is now live on the board. Colleagues at your trust can see it and reach out.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/dashboard"
              className="px-5 py-2.5 bg-nhs-blue text-white font-semibold rounded-xl hover:bg-nhs-dark transition-colors text-sm"
            >
              View board
            </Link>
            <button
              onClick={() => { setDone(false); setStep(1); setForm({ offerType: '', offerDate: '', wantType: '', wantDate: '', note: '', urgent: false }) }}
              className="px-5 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 text-sm"
            >
              Post another
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-4">
            <ArrowLeft size={15} /> Back to board
          </Link>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Post a swap</h1>

          {/* Progress */}
          <div className="flex items-center gap-2 mt-4">
            {[1, 2].map(n => (
              <React.Fragment key={n}>
                <div className={`flex items-center gap-2`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step >= n ? 'bg-nhs-blue text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step > n ? <Check size={12} /> : n}
                  </div>
                  <span className={`text-sm font-medium ${step >= n ? 'text-gray-900' : 'text-gray-400'}`}>
                    {n === 1 ? 'Your shift' : 'What you want'}
                  </span>
                </div>
                {n < 2 && <div className={`flex-1 h-px ${step > 1 ? 'bg-nhs-blue' : 'bg-gray-100'}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 mt-8">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Which shift are you offering?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SHIFT_TYPES.map(shift => (
                  <ShiftCard
                    key={shift.id}
                    shift={shift}
                    selected={form.offerType === shift.id}
                    onSelect={selectOfferType}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date of the shift</label>
              <input
                type="date"
                value={form.offerDate}
                onChange={e => set('offerDate', e.target.value)}
                min={new Date().toISOString().slice(0, 10)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-nhs-blue bg-white"
              />
            </div>

            {form.offerType && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-nhs-blue flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={10} className="text-white" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">
                    {SHIFT_TYPES.find(s => s.id === form.offerType)?.label} shift selected
                  </p>
                  <p className="text-gray-500 mt-0.5">
                    Hours: {SHIFT_TYPES.find(s => s.id === form.offerType)?.time}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => setStep(2)}
              disabled={!canNext()}
              className="w-full py-3 bg-nhs-blue text-white font-semibold rounded-xl hover:bg-nhs-dark transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
            >
              Next: What you want <ArrowRight size={16} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                What shift type do you want in return?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SHIFT_TYPES.map(shift => (
                  <ShiftCard
                    key={shift.id}
                    shift={shift}
                    selected={form.wantType === shift.id}
                    onSelect={v => set('wantType', v)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Preferred date <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="date"
                value={form.wantDate}
                onChange={e => set('wantDate', e.target.value)}
                min={new Date().toISOString().slice(0, 10)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-nhs-blue bg-white"
              />
              <p className="text-xs text-gray-400 mt-1.5">Leave blank if you're flexible on dates</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Notes <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                rows={3}
                value={form.note}
                onChange={e => set('note', e.target.value)}
                placeholder="Any extra context — which ward, cover requirements, flexible on dates, etc."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-nhs-blue resize-none"
              />
            </div>

            <label className="flex items-center gap-3 p-4 border border-rose-100 bg-rose-50 rounded-xl cursor-pointer hover:bg-rose-100 transition-colors">
              <input
                type="checkbox"
                checked={form.urgent}
                onChange={e => set('urgent', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
              />
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-rose-500" />
                <span className="text-sm font-medium text-gray-900">Mark as urgent</span>
              </div>
              <span className="text-xs text-gray-500 ml-auto">Shown at top of board</span>
            </label>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 flex items-center gap-2 text-sm"
              >
                <ArrowLeft size={15} /> Back
              </button>
              <button
                onClick={submit}
                disabled={!canSubmit()}
                className="flex-1 py-3 bg-nhs-blue text-white font-semibold rounded-xl hover:bg-nhs-dark transition-colors disabled:opacity-40 text-sm"
              >
                Post swap
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
