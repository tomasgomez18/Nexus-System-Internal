import { useEffect, useState } from 'react'
import { useToast, confirmDialog } from '../components/Notifications'
import {
  createAccount,
  deleteAccount,
  getAccounts,
  updateAccount,
} from '../services/api'

const inputClass =
  'w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500'

const labelClass = 'block text-xs text-gray-500 mb-1'

const emptyForm = { platform: '', email: '', password: '' }

export default function Accounts() {
  const { toast } = useToast()
  const [accounts, setAccounts] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    setError(null)
    getAccounts()
      .then(setAccounts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setShowPassword(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingId) {
        await updateAccount(editingId, form)
        toast.success('Cuenta actualizada')
      } else {
        await createAccount(form)
        toast.success('Cuenta guardada')
      }
      resetForm()
      load()
    } catch (err) {
      toast.error(err.message || 'Ocurrió un error al guardar la cuenta')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (account) => {
    setForm({
      platform: account.platform,
      email: account.email,
      password: account.password,
    })
    setEditingId(account._id)
    setShowPassword(false)
  }

  const handleDelete = async (id) => {
    const ok = await confirmDialog({
      title: 'Eliminar cuenta',
      message: '¿Eliminar esta cuenta personal?',
      confirmLabel: 'Eliminar',
      danger: true,
    })
    if (!ok) return
    try {
      await deleteAccount(id)
      toast.success('Cuenta eliminada')
      if (editingId === id) resetForm()
      setAccounts((prev) => prev.filter((a) => a._id !== id))
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-white">Cuentas personales</h1>
        <p className="text-sm text-gray-400">Plataformas, mails y contraseñas</p>
      </header>

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-3">
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6 md:max-w-xl"
      >
        <h2 className="text-sm font-semibold text-gray-300 mb-3">
          {editingId ? 'Editar cuenta' : 'Nueva cuenta'}
        </h2>

        <label className={labelClass}>Plataforma *</label>
        <input
          className={inputClass}
          required
          placeholder="Ej: Instagram, Netflix, Hostinger"
          value={form.platform}
          onChange={(e) => set('platform', e.target.value)}
        />

        <label className={`${labelClass} mt-3`}>Email *</label>
        <input
          className={inputClass}
          required
          type="email"
          placeholder="tucorreo@mail.com"
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
        />

        <label className={`${labelClass} mt-3`}>Contraseña *</label>
        <div className="relative">
          <input
            className={`${inputClass} pr-10`}
            required
            type={showPassword ? 'text' : 'password'}
            placeholder="contraseña"
            value={form.password}
            onChange={(e) => set('password', e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute inset-y-0 right-0 px-3 text-gray-400 active:text-gray-200"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? 'Ocultar' : 'Ver'}
          </button>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 text-sm font-semibold text-white bg-emerald-600 rounded-xl px-4 py-3 active:scale-[0.99] disabled:opacity-50"
          >
            {saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Guardar cuenta'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm font-medium text-gray-300 bg-gray-800 rounded-xl px-4 py-3 active:scale-[0.99]"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="text-gray-400 text-sm">Cargando...</p>
      ) : accounts.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-sm">Todavía no hay cuentas cargadas</p>
          <p className="text-xs mt-1">Completá el formulario para agregar la primera</p>
        </div>
      ) : (
        <div className="md:grid md:grid-cols-2 xl:grid-cols-3 md:gap-4">
          {accounts.map((account) => {
            const isEditing = editingId === account._id
            return (
              <div
                key={account._id}
                className={`bg-gray-900 border rounded-xl p-3 mb-2 md:mb-0 ${
                  isEditing ? 'border-emerald-500/50' : 'border-gray-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {account.platform}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{account.email}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleEdit(account)}
                      className="text-xs font-medium text-sky-400 active:scale-95"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(account._id)}
                      className="text-xs font-medium text-red-400 active:scale-95"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-400 truncate">••••••••</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}