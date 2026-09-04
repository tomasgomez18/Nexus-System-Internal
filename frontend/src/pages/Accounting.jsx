import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteMovement, formatDate, formatMoney, getMonth } from '../services/api'

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const categoryLabels = {
  'pago-inicial': 'Pago inicial',
  'pago-final': 'Pago final',
  'otro-ingreso': 'Otro ingreso',
  suscripcion: 'Suscripción',
  hosting: 'Hosting',
  herramienta: 'Herramienta',
  'otro-egreso': 'Otro egreso',
}

export default function Accounting() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = () => {
    setLoading(true)
    setError(null)
    getMonth(year, month)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [year, month])

  const prev = () => {
    if (month === 1) {
      setMonth(12)
      setYear(year - 1)
    } else setMonth(month - 1)
  }

  const next = () => {
    if (month === 12) {
      setMonth(1)
      setYear(year + 1)
    } else setMonth(month + 1)
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este movimiento?')) return
    await deleteMovement(id)
    setData(await getMonth(year, month))
  }

  return (
    <div className="p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-white">Contable</h1>
        <p className="text-sm text-gray-400">Ingresos y egresos del mes</p>
      </header>

      <div className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 mb-4 md:max-w-xl">
        <button onClick={prev} className="w-10 h-10 text-gray-400 active:scale-90 text-xl">
          ←
        </button>
        <span className="font-semibold text-white">
          {MONTHS[month - 1]} {year}
        </span>
        <button onClick={next} className="w-10 h-10 text-gray-400 active:scale-90 text-xl">
          →
        </button>
      </div>

      {error ? (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
          <p className="mb-2">Error al cargar: {error}</p>
          <button
            onClick={load}
            className="text-sm font-medium text-white bg-red-500/20 border border-red-500/40 rounded-lg px-4 py-2 active:scale-95"
          >
            Reintentar
          </button>
        </div>
      ) : loading || !data ? (
        <p className="text-gray-400 text-sm">Cargando...</p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2 mb-4 md:max-w-xl">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-center">
              <p className="text-xs text-emerald-400">Ingresos</p>
              <p className="text-sm font-bold text-emerald-400 mt-1">
                {formatMoney(data.ingresos)}
              </p>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-center">
              <p className="text-xs text-red-400">Egresos</p>
              <p className="text-sm font-bold text-red-400 mt-1">
                {formatMoney(data.egresos)}
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400">Balance</p>
              <p
                className={`text-sm font-bold mt-1 ${
                  data.balance >= 0 ? 'text-white' : 'text-red-400'
                }`}
              >
                {formatMoney(data.balance)}
              </p>
            </div>
          </div>

          <Link
            to="/nuevo-gasto"
            className="block text-center text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-4 md:max-w-xl active:scale-[0.99]"
          >
            − Registrar gasto
          </Link>

          <h2 className="text-sm font-semibold text-gray-300 mb-2">
            Movimientos del mes ({data.movements.length})
          </h2>

          {data.movements.length === 0 ? (
            <p className="text-sm text-gray-500">Sin movimientos este mes</p>
          ) : (
            <div className="md:grid md:grid-cols-2 xl:grid-cols-3 md:gap-4">
              {data.movements.map((m) => (
                <div
                  key={m._id}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-3 mb-2 md:mb-0 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-100 truncate">{m.concept}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(m.date)} · {categoryLabels[m.category] || m.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-sm font-bold ${
                        m.type === 'ingreso' ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {m.type === 'ingreso' ? '+' : '-'}
                      {formatMoney(m.amount)}
                    </span>
                    <button
                      onClick={() => handleDelete(m._id)}
                      className="text-gray-600 active:text-red-400 text-lg leading-none"
                      aria-label="Eliminar"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}