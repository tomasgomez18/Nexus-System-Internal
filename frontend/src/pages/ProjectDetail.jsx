import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  deleteProject,
  formatDate,
  formatMoney,
  getProject,
  updateProject,
} from '../services/api'

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

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar el proyecto de ${project.client}?`)) return
    await deleteProject(id)
    navigate('/')
  }

  const handleFinalize = async () => {
    const incomeMsg =
      project.finalPayment > 0
        ? `Se registrará automáticamente ${formatMoney(
            project.finalPayment
          )} (pago final) como ingreso en Contable.`
        : 'El pago final está en $0, no se registrará ingreso adicional.'
    if (!confirm(`¿Marcar como finalizado?\n${incomeMsg}`)) return
    const updated = await updateProject(id, { status: 'finalizado' })
    setProject(updated)
  }

  const rows = [
    ['Cliente', project.client],
    ['Tipo de proyecto', project.projectType],
    ['Precio final', formatMoney(project.finalPrice)],
    ['Fecha de inicio', formatDate(project.startDate)],
    ['Fecha de finalización', project.endDate ? formatDate(project.endDate) : '—'],
    ['Método de pago', project.paymentMethod],
    ['Pago inicial', formatMoney(project.initialPayment)],
    ['Pago final', formatMoney(project.finalPayment)],
    ['Saldo', `${formatMoney(saldo)} (${saldo > 0 ? 'pendiente' : 'al día'})`],
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

      {project.status !== 'finalizado' && (
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