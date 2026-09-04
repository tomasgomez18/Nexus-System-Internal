import { Link } from 'react-router-dom'
import { formatDate, formatMoney } from '../services/api'

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

export default function ProjectCard({ project }) {
  const saldo = project.finalPrice - project.initialPayment - project.finalPayment

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
            Saldo: {formatMoney(saldo)}
          </p>
        </div>
      </div>
    </Link>
  )
}