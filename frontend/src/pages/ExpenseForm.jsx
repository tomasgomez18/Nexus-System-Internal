import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createMovement } from '../services/api'

const EXPENSE_CATEGORIES = [
  { value: 'suscripcion', label: 'Suscripción' },
  { value: 'hosting', label: 'Hosting' },
  { value: 'herramienta', label: 'Herramienta' },
  { value: 'otro-egreso', label: 'Otro egreso' },
]

const inputClass =
  'w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500'

const labelClass = 'block text-xs text-gray-500 mb-1'

const localToday = () => {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export default function ExpenseForm() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    type: 'egreso',
    concept: '',
    amount: '',
    date: localToday(),
    category: 'suscripcion',
  })

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await createMovement({
        ...form,
        amount: Number(form.amount) || 0,
      })
      navigate('/contable')
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-white mb-4">Nuevo gasto</h1>

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-3">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="md:grid md:grid-cols-2 md:gap-x-4 md:max-w-2xl">
        <label className={labelClass}>Concepto *</label>
        <input
          className={inputClass}
          required
          placeholder="Ej: Suscripción Cloudinary, Hosting, Canva"
          value={form.concept}
          onChange={(e) => set('concept', e.target.value)}
        />

        <label className={`${labelClass} mt-3 md:mt-0`}>Monto (ARS) *</label>
        <input
          className={inputClass}
          required
          type="number"
          min="0"
          placeholder="2500"
          value={form.amount}
          onChange={(e) => set('amount', e.target.value)}
        />

        <label className={`${labelClass} mt-3`}>Fecha *</label>
        <input
          className={inputClass}
          required
          type="date"
          value={form.date}
          onChange={(e) => set('date', e.target.value)}
        />

        <label className={`${labelClass} mt-3 md:mt-0`}>Categoría</label>
        <select
          className={inputClass}
          value={form.category}
          onChange={(e) => set('category', e.target.value)}
        >
          {EXPENSE_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={saving}
          className="w-full mt-6 md:col-span-2 text-sm font-semibold text-white bg-emerald-600 rounded-xl px-4 py-3.5 active:scale-[0.99] disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar gasto'}
        </button>
      </form>
    </div>
  )
}