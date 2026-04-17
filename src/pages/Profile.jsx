import React from 'react'
import { Trash2, Building2, Stethoscope, GraduationCap, CreditCard, Calendar, Mail } from 'lucide-react'
import { useApp } from '../store'

const SHIFT_COLORS = {
  'day': 'bg-amber-100 text-amber-700',
  'long-day': 'bg-orange-100 text-orange-700',
  'night': 'bg-indigo-100 text-indigo-700',
  'twilight': 'bg-purple-100 text-purple-700',
  'weekend-day': 'bg-emerald-100 text-emerald-700',
  'weekend-night': 'bg-rose-100 text-rose-700',
  'on-call': 'bg-sky-100 text-sky-700',
}

function shiftLabel(id) {
  const map = {
    'day': 'Day', 'long-day': 'Long Day', 'night': 'Night',
    'twilight': 'Twilight', 'weekend-day': 'Weekend Day',
    'weekend-night': 'Weekend Night', 'on-call': 'On-Call',
  }
  return map[id] || id
}

function formatDate(str) {
  if (!str) return '—'
  const d = new Date(str)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function Profile() {
  const { user, swaps, deleteSwap } = useApp()

  const mySwaps = swaps.filter(s => s.userId === user.id)

  const initials = user.name
    .replace('Dr ', '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')

  const info = [
    { icon: Mail, label: 'NHS email', value: user.email },
    { icon: Building2, label: 'Trust', value: user.trust },
    { icon: Stethoscope, label: 'Department', value: user.department },
    { icon: GraduationCap, label: 'Grade', value: user.grade },
    { icon: CreditCard, label: 'GMC number', value: user.gmc },
    { icon: Calendar, label: 'Member since', value: formatDate(user.joinDate) },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-nhs-blue flex items-center justify-center text-white text-2xl font-bold font-heading flex-shrink-0">
              {initials}
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-500 mt-0.5">{user.grade} · {user.department}</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 bg-blue-100 text-nhs-blue text-xs font-semibold rounded-full">
                {user.trust}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-8 space-y-6">
        {/* Info card */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="font-heading font-semibold text-gray-900">Account details</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {info.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 px-6 py-3.5">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-gray-500" />
                </div>
                <div className="flex-1 flex justify-between items-center min-w-0">
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="text-sm font-medium text-gray-900 text-right ml-4 truncate max-w-xs">{value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My listings */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-heading font-semibold text-gray-900">My listings</h2>
            <span className="text-sm text-gray-400">{mySwaps.length} active</span>
          </div>

          {mySwaps.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-400 text-sm">You haven't posted any swaps yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {mySwaps.map(swap => (
                <div key={swap.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${SHIFT_COLORS[swap.offerType] || 'bg-gray-100 text-gray-600'}`}>
                        {shiftLabel(swap.offerType)}
                      </span>
                      {swap.urgent && (
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-600 text-xs font-semibold rounded-full">Urgent</span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      Offering {shiftLabel(swap.offerType)} on {formatDate(swap.offerDate)}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Wants: {shiftLabel(swap.wantType)}
                      {swap.wantDate ? ` · ${formatDate(swap.wantDate)}` : ' (flexible date)'}
                    </p>
                    {swap.note && <p className="text-xs text-gray-400 mt-0.5 truncate">"{swap.note}"</p>}
                  </div>
                  <button
                    onClick={() => deleteSwap(swap.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors flex-shrink-0"
                    title="Delete listing"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
