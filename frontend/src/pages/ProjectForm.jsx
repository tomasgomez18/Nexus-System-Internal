import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AccountForm from '../components/AccountForm'
import { useToast } from '../components/Notifications'
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
  status: 'pendiente',
  accounts: [],
}

export default function ProjectForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    getProject(id).then((p) =>
      setForm({
        ...p,
        finalPrice: p.finalPrice,
        initialPayment: p.initialPayment,
        startDate: p.startDate?.slice(0, 10),
        endDate: p.endDate?.slice(0, 10) || '',
      })
    )
  }, [id])

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const remaining = Math.max(
    (Number(form.finalPrice) || 0) - (Number(form.initialPayment) || 0),
    0
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const body = {
        ...form,
        finalPrice: Number(form.finalPrice) || 0,
        initialPayment: Number(form.initialPayment) || 0,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
      }
      if (id) {
        await updateProject(id, body)
      } else {
        const today = new Date()
        const todayStr = `${today.getFullYear()}-${String(
          today.getMonth() + 1
        ).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
        if (body.status === 'pendiente' && body.startDate === todayStr) {
          body.status = 'en-progreso'
        }
        await createProject(body)
      }
      toast.success(id ? 'Cambios guardados' : 'Proyecto creado')
      navigate('/')
    } catch (err) {
      toast.error(err.message || 'Ocurrió un error al guardar el proyecto')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-white mb-4">
        {id ? 'Editar proyecto' : 'Nuevo proyecto'}
      </h1>

      <form onSubmit={handleSubmit} className="md:grid md:grid-cols-2 md:gap-4">
        <div>
          <label className={labelClass}>Cliente *</label>
          <input
            className={inputClass}
            required
            placeholder="Nombre del cliente"
            value={form.client}
            onChange={(e) => set('client', e.target.value)}
          />
        </div>

        <div className="mt-3 md:mt-0">
          <label className={labelClass}>Tipo de proyecto *</label>
          <input
            className={inputClass}
            required
            placeholder="Ej: Web, Ecommerce, Landing, Sistema"
            value={form.projectType}
            onChange={(e) => set('projectType', e.target.value)}
          />
        </div>

        <div className="mt-3 md:mt-0">
          <label className={labelClass}>Precio final (ARS) *</label>
          <input
            className={inputClass}
            required
            type="number"
            min="0"
            placeholder="50000"
            value={form.finalPrice}
            onChange={(e) => set('finalPrice', e.target.value)}
          />
        </div>

        <div className="mt-3 md:mt-0">
          <label className={labelClass}>Método de pago</label>
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
        </div>

        <div className="md:col-span-2 mt-3 md:mt-0">
          <div className="grid grid-cols-2 gap-3">
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
              Se cobra al comenzar el proyecto y se registra como ingreso en la fecha
              de inicio
            </p>
            </div>
            <div>
<label className={labelClass}>Pago final (ARS)</label>
            <input
              className={`${inputClass} disabled:opacity-60 disabled:cursor-not-allowed`}
              type="number"
              min="0"
              disabled
              value={remaining}
            />
            <p className="text-[11px] text-gray-600 mt-1">
              Deuda restante. Se cobra automáticamente al finalizar el proyecto
            </p>
            </div>
          </div>

          {!id && (
            <p className="text-[11px] text-gray-600 mt-2">
              Si la fecha de inicio es hoy, el proyecto se crea directamente como "En
              progreso".
            </p>
          )}
        </div>

        <div className="mt-3 md:mt-0">
          <label className={labelClass}>Estado</label>
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
        </div>

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