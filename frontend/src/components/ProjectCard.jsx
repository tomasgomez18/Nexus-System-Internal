import { Link } from 'react-router-dom'
import { formatDate, formatMoney, updateProject } from '../services/api'
import { confirmDialog, useToast } from './Notifications'

const statusStyles = {
  pendiente: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  'en-progreso': 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  finalizado: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
}

const statusLabels = {
  pendiente: 'Pendiente',
  'en-progreso': 'En progreso',
  finalizado: 'Finalizado',
}

export default function ProjectCard({ project, onStatusChange }) {
  const { toast } = useToast()
  const saldo = project.finalPrice - project.initialPayment - project.finalPayment
  const remaining = Math.max(
    (project.finalPrice || 0) - (project.initialPayment || 0),
    0
  )

  const handleAdvance = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (project.status === 'en-progreso') {
      const incomeMsg =
        remaining > 0
          ? `Se registrará ${formatMoney(
              remaining
            )} (saldo restante) como ingreso en Contable.`
          : 'No queda saldo pendiente, no se registrará ingreso adicional.'
      const ok = await confirmDialog({
        title: 'Marcar como finalizado',
        message: incomeMsg,
        confirmLabel: 'Finalizar',
      })
      if (!ok) return
    }
    try {
      const next = project.status === 'pendiente' ? 'en-progreso' : 'finalizado'
      const updated = await updateProject(project._id, { status: next })
      onStatusChange(updated)
      toast.success(next === 'finalizado' ? 'Proyecto finalizado' : 'Proyecto en progreso')
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <Link
      to={`/proyecto/${project._id}`}
      className="block bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-3 md:mb-0 active:scale-[0.99] transition-transform"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-white">{project.client}</h2>
          <p className="text-sm text-gray-400">{project.projectType}</p>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full border font-medium ${statusStyles[project.status]}`}
        >
          {statusLabels[project.status]}
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {formatDate(project.startDate)}
            {project.endDate ? ` → ${formatDate(project.endDate)}` : ''}
          </p>
          <p className="text-xs text-gray-500">{project.paymentMethod}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-emerald-400">
            {formatMoney(project.finalPrice)}
          </p>
          <p
            className={`text-xs font-medium ${
              saldo > 0 ? 'text-amber-400' : 'text-emerald-500'
            }`}
          >
            {saldo > 0 ? `Deuda: ${formatMoney(saldo)}` : 'Al día'}
          </p>
        </div>
      </div>

      {project.status !== 'finalizado' && (
        <button
          onClick={handleAdvance}
          className={`mt-3 w-full text-sm font-semibold rounded-lg px-3 py-2 active:scale-[0.98] ${
            project.status === 'pendiente'
              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
              : 'bg-emerald-600 text-white'
          }`}
        >
          {project.status === 'pendiente' ? '▶ Iniciar' : '✓ Finalizar'}
        </button>
      )}
    </Link>
  )
}