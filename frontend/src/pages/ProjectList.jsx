import { useEffect, useState } from 'react'
import ProjectCard from '../components/ProjectCard'
import { getProjects } from '../services/api'

const statusOptions = [
  { value: 'todos', label: 'Todos' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en-progreso', label: 'En progreso' },
  { value: 'finalizado', label: 'Finalizado' },
]

const normalize = (str) =>
  (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const statusPriority = {
  pendiente: 0,
  'en-progreso': 1,
  finalizado: 2,
}

const filterClass = (active) =>
  `px-2.5 py-1 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${
    active
      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
      : 'bg-gray-900 text-gray-400 border-gray-800 hover:text-gray-200'
  }`

export default function ProjectList() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('todos')

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const query = normalize(search)
  const filtered = projects
    .filter((project) => {
      const matchesStatus = status === 'todos' || project.status === status
      const matchesSearch =
        !query ||
        normalize(project.client).includes(query) ||
        normalize(project.projectType).includes(query)
      return matchesStatus && matchesSearch
    })
    .sort(
      (a, b) =>
        (statusPriority[a.status] ?? 3) - (statusPriority[b.status] ?? 3) ||
        new Date(b.createdAt) - new Date(a.createdAt)
    )

  const handleStatusChange = (updated) =>
    setProjects((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))

  return (
    <div className="p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-white">Proyectos</h1>
        <p className="text-sm text-gray-400">Cartera de clientes</p>
      </header>

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-3">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-gray-400 text-sm">Cargando...</p>
      ) : projects.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm">Todavía no hay proyectos</p>
          <p className="text-gray-600 text-xs mt-1">Tocá + Nuevo para crear el primero</p>
        </div>
      ) : (
        <>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por cliente o tipo..."
            className="w-full mb-3 md:max-w-md bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
          />

          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setStatus(option.value)}
                className={filterClass(status === option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-sm">No se encontraron proyectos</p>
            </div>
          ) : (
            <div className="md:grid md:grid-cols-2 xl:grid-cols-3 md:gap-4">
              {filtered.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}