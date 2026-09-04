import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AccountForm from '../components/AccountForm'
import { createProject, getProject, updateProject } from '../services/api'

const PAYMENT_METHODS = ['Efectivo', 'Transferencia', 'Tarjeta', 'Cripto', 'Otro']
const STATUSES = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en-progreso', label: 'En progreso' },
  { value: 'finalizado', label: 'Finalizado' },
]

const inputClass =
  'w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500'

const labelClass = 'block text-xs text-gray-500 mb-1'

const emptyForm = {
  client: '',
  projectType: '',
  finalPrice: '',
  startDate: '',
  endDate: '',
  paymentMethod: 'Efectivo',
  initialPayment: '',
  finalPayment: '',
  status: 'pendiente',
  accounts: [],
}

export default function ProjectForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    getProject(id).then((p) =>
      setForm({
        ...p,
        finalPrice: p.finalPrice,
        initialPayment: p.initialPayment,
        finalPayment: p.finalPayment,
        startDate: p.startDate?.slice(0, 10),
        endDate: p.endDate?.slice(0, 10) || '',
      })
    )
  }, [id])

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const body = {
        ...form,
        finalPrice: Number(form.finalPrice) || 0,
        initialPayment: Number(form.initialPayment) || 0,
        finalPayment: Number(form.finalPayment) || 0,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
      }
      if (id) await updateProject(id, body)
      else await createProject(body)
      navigate('/')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-white mb-4">
        {id ? 'Editar proyecto' : 'Nuevo proyecto'}
      </h1>

      <form onSubmit={handleSubmit} className="md:grid md:grid-cols-2 md:gap-x-4">
        <label className={labelClass}>Cliente *</label>
        <input
          className={inputClass}
          required
          placeholder="Nombre del cliente"
          value={form.client}
          onChange={(e) => set('client', e.target.value)}
        />

        <label className={`${labelClass} mt-3 md:mt-0`}>Tipo de proyecto *</label>
        <input
          className={inputClass}
          required
          placeholder="Ej: Web, Ecommerce, Landing, Sistema"
          value={form.projectType}
          onChange={(e) => set('projectType', e.target.value)}
        />

        <label className={`${labelClass} mt-3`}>Precio final (ARS) *</label>
        <input
          className={inputClass}
          required
          type="number"
          min="0"
          placeholder="50000"
          value={form.finalPrice}
          onChange={(e) => set('finalPrice', e.target.value)}
        />

        <label className={`${labelClass} mt-3 md:mt-0`}>Método de pago</label>
        <select
          className={inputClass}
          value={form.paymentMethod}
          onChange={(e) => set('paymentMethod', e.target.value)}
        >
          {PAYMENT_METHODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <div className="md:col-span-2">
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className={labelClass}>Fecha de inicio *</label>
              <input
                className={inputClass}
                required
                type="date"
                value={form.startDate}
                onChange={(e) => set('startDate', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Fecha de finalización</label>
              <input
                className={inputClass}
                type="date"
                value={form.endDate}
                onChange={(e) => set('endDate', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
<label className={labelClass}>Pago inicial (ARS)</label>
            <input
              className={inputClass}
              type="number"
              min="0"
              placeholder="20000"
              value={form.initialPayment}
              onChange={(e) => set('initialPayment', e.target.value)}
            />
            <p className="text-[11px] text-gray-600 mt-1">
              Se registra como ingreso automático en la fecha de inicio
            </p>
            </div>
            <div>
<label className={labelClass}>Pago final (ARS)</label>
            <input
              className={inputClass}
              type="number"
              min="0"
              placeholder="30000"
              value={form.finalPayment}
              onChange={(e) => set('finalPayment', e.target.value)}
            />
            <p className="text-[11px] text-gray-600 mt-1">
              Se registra al marcar el proyecto finalizado
            </p>
            </div>
          </div>
        </div>

        <label className={`${labelClass} mt-3`}>Estado</label>
        <select
          className={inputClass}
          value={form.status}
          onChange={(e) => set('status', e.target.value)}
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        {form.status === 'finalizado' && (
          <p className="text-xs text-emerald-400/80 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2 mt-2">
            Al guardar se registrará automáticamente el pago final como ingreso en
            Contable (fecha de finalización).
          </p>
        )}

        <div className="md:col-span-2">
          <AccountForm accounts={form.accounts} onChange={(accounts) => set('accounts', accounts)} />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full mt-6 md:col-span-2 text-sm font-semibold text-white bg-emerald-600 rounded-xl px-4 py-3.5 active:scale-[0.99] disabled:opacity-50"
        >
          {saving ? 'Guardando...' : id ? 'Guardar cambios' : 'Crear proyecto'}
        </button>
      </form>
    </div>
  )
}