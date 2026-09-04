import { useEffect, useState } from 'react'
import ProjectCard from '../components/ProjectCard'
import { getProjects } from '../services/api'

export default function ProjectList() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-white">Proyectos</h1>
        <p className="text-sm text-gray-400">Organización de clientes</p>
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
        <div className="md:grid md:grid-cols-2 xl:grid-cols-3 md:gap-4">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}