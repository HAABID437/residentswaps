import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, PlusCircle, X, Send, AlertCircle } from 'lucide-react'
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
  if (!str) return 'Flexible'
  const d = new Date(str)
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

function ShiftBadge({ type, className = '' }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${SHIFT_COLORS[type] || 'bg-gray-100 text-gray-600'} ${className}`}>
      {shiftLabel(type)}
    </span>
  )
}

function SwapModal({ swap, onClose }) {
  const { user } = useApp()
  const [msg, setMsg] = useState('')
  const [sent, setSent] = useState(false)

  function send() {
    if (!msg.trim()) return
    setSent(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        {!sent ? (
          <>
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="font-heading font-bold text-gray-900">Offer a swap</h3>
                <p className="text-sm text-gray-500 mt-0.5">Send a message to {swap.userName}</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Their shift</span>
                <span className="font-medium flex items-center gap-2">
                  <ShiftBadge type={swap.offerType} /> · {formatDate(swap.offerDate)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">They want</span>
                <span className="font-medium"><ShiftBadge type={swap.wantType} /></span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Your message
              </label>
              <textarea
                rows={4}
                value={msg}
                onChange={e => setMsg(e.target.value)}
                placeholder={`Hi ${swap.userName.split(' ').pop()}, I'm ${user.name} (${user.grade}, ${user.department}). I can offer a swap for…`}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-nhs-blue resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 text-sm">
                Cancel
              </button>
              <button
                onClick={send}
                disabled={!msg.trim()}
                className="flex-1 py-2.5 bg-nhs-blue text-white font-semibold rounded-xl hover:bg-nhs-dark transition-colors disabled:opacity-50 text-sm flex items-center justify-center gap-2"
              >
                <Send size={14} /> Send message
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send size={24} className="text-emerald-600" />
            </div>
            <h3 className="font-heading font-bold text-gray-900 text-lg mb-2">Message sent!</h3>
            <p className="text-sm text-gray-500 mb-6">
              Your message has been sent to {swap.userName}. They'll be notified to get back to you.
            </p>
            <button onClick={onClose} className="px-6 py-2.5 bg-nhs-blue text-white font-semibold rounded-xl hover:bg-nhs-dark transition-colors text-sm">
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user, trustSwaps, SHIFT_TYPES } = useApp()
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterDept, setFilterDept] = useState('')
  const [modal, setModal] = useState(null)

  const departments = useMemo(() => {
    const depts = [...new Set(trustSwaps.map(s => s.department))].sort()
    return depts
  }, [trustSwaps])

  const filtered = useMemo(() => {
    return trustSwaps.filter(s => {
      if (s.userId === user.id) return false
      if (filterType && s.offerType !== filterType) return false
      if (filterDept && s.department !== filterDept) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          s.userName.toLowerCase().includes(q) ||
          s.department.toLowerCase().includes(q) ||
          s.grade.toLowerCase().includes(q) ||
          shiftLabel(s.offerType).toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [trustSwaps, user.id, filterType, filterDept, search])

  const urgent = filtered.filter(s => s.urgent)
  const regular = filtered.filter(s => !s.urgent)

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl font-bold text-gray-900">
                Swap board
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">{user.trust}</p>
            </div>
            <Link
              to="/post"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-nhs-blue text-white font-semibold rounded-xl hover:bg-nhs-dark transition-colors text-sm"
            >
              <PlusCircle size={16} /> Post a swap
            </Link>
          </div>

          {/* Search + filters */}
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, department, grade…"
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-nhs-blue focus:bg-white"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
                  className="pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-nhs-blue focus:bg-white appearance-none"
                >
                  <option value="">All shifts</option>
                  {SHIFT_TYPES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
              <select
                value={filterDept}
                onChange={e => setFilterDept(e.target.value)}
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-nhs-blue focus:bg-white"
              >
                <option value="">All departments</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-6 space-y-6">
        {/* Urgent swaps */}
        {urgent.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={16} className="text-rose-500" />
              <h2 className="font-heading font-semibold text-gray-900 text-sm uppercase tracking-wide">Urgent</h2>
              <span className="px-2 py-0.5 bg-rose-100 text-rose-600 rounded-full text-xs font-semibold">{urgent.length}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {urgent.map(swap => <SwapCard key={swap.id} swap={swap} onOffer={() => setModal(swap)} />)}
            </div>
          </div>
        )}

        {/* Regular swaps */}
        {regular.length > 0 && (
          <div>
            <h2 className="font-heading font-semibold text-gray-900 text-sm uppercase tracking-wide mb-3">
              {urgent.length > 0 ? 'All listings' : 'Open swaps'} <span className="text-gray-400 ml-1 normal-case font-normal">({regular.length})</span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {regular.map(swap => <SwapCard key={swap.id} swap={swap} onOffer={() => setModal(swap)} />)}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="font-heading font-semibold text-gray-900 mb-2">No swaps found</h3>
            <p className="text-sm text-gray-500 mb-6">
              {search || filterType || filterDept
                ? 'Try adjusting your search or filters'
                : 'Be the first to post a swap at your trust'}
            </p>
            <Link
              to="/post"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-nhs-blue text-white font-semibold rounded-xl hover:bg-nhs-dark transition-colors text-sm"
            >
              <PlusCircle size={16} /> Post the first swap
            </Link>
          </div>
        )}
      </div>

      {modal && <SwapModal swap={modal} onClose={() => setModal(null)} />}
    </div>
  )
}

function SwapCard({ swap, onOffer }) {
  const relativeTime = () => {
    const diff = Date.now() - new Date(swap.createdAt).getTime()
    const days = Math.floor(diff / 86400000)
    const hours = Math.floor(diff / 3600000)
    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    return 'Just now'
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-nhs-blue flex items-center justify-center text-white text-sm font-semibold font-heading flex-shrink-0">
            {swap.userName.replace('Dr ', '').split(' ').map(w => w[0]).slice(0, 2).join('')}
          </div>
          <div>
            <p className="font-heading font-semibold text-gray-900 text-sm">{swap.userName}</p>
            <p className="text-xs text-gray-400">{swap.grade} · {swap.department}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {swap.urgent && (
            <span className="px-2 py-0.5 bg-rose-100 text-rose-600 text-xs font-semibold rounded-full flex items-center gap-1">
              <AlertCircle size={10} /> Urgent
            </span>
          )}
          <ShiftBadge type={swap.offerType} />
        </div>
      </div>

      {/* Shift details */}
      <div className="bg-gray-50 rounded-xl p-3.5 mb-4 space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Offering</span>
          <span className="font-medium text-gray-900">{shiftLabel(swap.offerType)} · {formatDate(swap.offerDate)}</span>
        </div>
        <div className="h-px bg-gray-100" />
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Wants</span>
          <span className="font-medium text-gray-900 flex items-center gap-1.5">
            <ShiftBadge type={swap.wantType} />
            {swap.wantDate ? <span className="text-gray-500 font-normal">· {formatDate(swap.wantDate)}</span> : <span className="text-gray-400 font-normal text-xs">Flexible date</span>}
          </span>
        </div>
      </div>

      {swap.note && (
        <p className="text-sm text-gray-500 mb-4 leading-relaxed italic">"{swap.note}"</p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">{relativeTime()}</span>
        <button
          onClick={onOffer}
          className="px-4 py-2 bg-nhs-blue text-white text-sm font-semibold rounded-lg hover:bg-nhs-dark transition-colors"
        >
          Offer swap
        </button>
      </div>
    </div>
  )
}

