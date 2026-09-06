import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  deleteProject,
  formatDate,
  formatMoney,
  getProject,
  updateProject,
} from '../services/api'
import { confirmDialog, useToast } from '../components/Notifications'

const statusLabels = {
  pendiente: 'Pendiente',
  'en-progreso': 'En progreso',
  finalizado: 'Finalizado',
}

const platformColors = {
  MongoDB: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Cloudinary: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  Dominio: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Otro: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
}

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProject(id)
      .then(setProject)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="p-4 text-gray-400 text-sm">Cargando...</p>
  if (!project) return <p className="p-4 text-gray-400 text-sm">Proyecto no encontrado</p>

  const saldo = project.finalPrice - project.initialPayment - project.finalPayment
  const remaining = Math.max(
    (project.finalPrice || 0) - (project.initialPayment || 0),
    0
  )

  const handleDelete = async () => {
    const ok = await confirmDialog({
      title: 'Eliminar proyecto',
      message: `¿Eliminar el proyecto de ${project.client}?`,
      confirmLabel: 'Eliminar',
      danger: true,
    })
    if (!ok) return
    try {
      await deleteProject(id)
      toast.success('Proyecto eliminado')
      navigate('/')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleStart = async () => {
    try {
      const updated = await updateProject(id, { status: 'en-progreso' })
      setProject(updated)
      toast.success('Proyecto en progreso')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleFinalize = async () => {
    const incomeMsg =
      remaining > 0
        ? `Se registrará automáticamente ${formatMoney(
            remaining
          )} (saldo restante) como ingreso en Contable.`
        : 'No queda saldo pendiente, no se registrará ingreso adicional.'
    const ok = await confirmDialog({
      title: 'Marcar como finalizado',
      message: incomeMsg,
      confirmLabel: 'Finalizar',
    })
    if (!ok) return
    try {
      const updated = await updateProject(id, { status: 'finalizado' })
      setProject(updated)
      toast.success('Proyecto finalizado')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const rows = [
    ['Cliente', project.client],
    ['Tipo de proyecto', project.projectType],
    ['Precio final', formatMoney(project.finalPrice)],
    ['Fecha de inicio', formatDate(project.startDate)],
    ['Fecha de finalización', project.endDate ? formatDate(project.endDate) : '—'],
    ['Método de pago', project.paymentMethod],
    ['Pago inicial', formatMoney(project.initialPayment)],
    ['Pago final', project.status === 'finalizado' ? formatMoney(project.finalPayment) : 'Pendiente de cobro'],
    ['Saldo', `${formatMoney(saldo)} (${saldo > 0 ? 'en deuda' : 'al día'})`],
    ['Estado', statusLabels[project.status]],
  ]

  return (
    <div className="p-4">
      <header className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{project.client}</h1>
          <p className="text-sm text-gray-400">{project.projectType}</p>
        </div>
        <Link
          to={`/editar/${project._id}`}
          className="text-sm font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2 active:scale-95"
        >
          Editar
        </Link>
      </header>

      <div className="md:grid md:grid-cols-2 md:gap-4 md:items-start">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-4 md:mb-0">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between px-4 py-3 border-b border-gray-800 last:border-0">
              <span className="text-sm text-gray-500">{label}</span>
              <span className="text-sm font-medium text-gray-100 text-right">{value}</span>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-300 mb-2">
            Cuentas de acceso ({project.accounts?.length || 0})
          </h2>
          {project.accounts?.length === 0 ? (
            <p className="text-sm text-gray-500 mb-4">Sin cuentas cargadas</p>
          ) : (
            <div className="md:grid md:grid-cols-2 md:gap-3">
              {project.accounts.map((acc, index) => (
                <div key={index} className="bg-gray-900 border border-gray-800 rounded-xl p-3 mb-3 md:mb-0">
                  <span
                    className={`inline-block text-xs px-2 py-0.5 rounded-full border font-medium mb-2 ${platformColors[acc.platform]}`}
                  >
                    {acc.platform}
                  </span>
                  <div className="space-y-1 text-sm">
                    {acc.email && (
                      <p className="text-gray-300">
                        <span className="text-gray-500">Email: </span>
                        {acc.email}
                      </p>
                    )}
                    {acc.password && (
                      <p className="text-gray-300">
                        <span className="text-gray-500">Contraseña: </span>
                        {acc.password}
                      </p>
                    )}
                    {acc.urlDomain && (
                      <p className="text-gray-300">
                        <span className="text-gray-500">Dominio: </span>
                        {acc.urlDomain}
                      </p>
                    )}
                    {acc.domainSource && (
                      <p className="text-gray-300">
                        <span className="text-gray-500">Origen: </span>
                        {acc.domainSource}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {project.status === 'pendiente' && (
        <button
          onClick={handleStart}
          className="w-full mb-3 text-sm font-semibold text-white bg-sky-600 rounded-xl px-4 py-3.5 active:scale-[0.99] md:flex-1"
        >
          ▶ Marcar en progreso
        </button>
      )}

      {project.status === 'en-progreso' && (
        <button
          onClick={handleFinalize}
          className="w-full mb-3 text-sm font-semibold text-white bg-emerald-600 rounded-xl px-4 py-3.5 active:scale-[0.99] md:flex-1"
        >
          ✓ Marcar como finalizado
        </button>
      )}

      <div className="md:flex md:items-center md:gap-3 md:mt-6">
        <Link
          to="/contable"
          className="block text-center text-sm font-medium text-sky-400 bg-sky-500/10 border border-sky-500/30 rounded-xl px-4 py-3 mb-3 md:mb-0 md:flex-1 active:scale-[0.99]"
        >
          Ver contabilidad del mes
        </Link>

        <button
          onClick={handleDelete}
          className="w-full md:flex-1 text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 active:scale-[0.99]"
        >
          Eliminar proyecto
        </button>
      </div>
    </div>
  )
}