const API = '/api'

async function request(path, options = {}) {
  let res
  try {
    res = await fetch(`${API}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch {
    throw new Error(
      'No se pudo conectar con el servidor. Revisá que el backend esté corriendo (npm run dev) y reintentá.'
    )
  }
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.message || 'Error en la petición')
  return data
}

export const getProjects = () => request('/projects')
export const getProject = (id) => request(`/projects/${id}`)
export const createProject = (body) =>
  request('/projects', { method: 'POST', body: JSON.stringify(body) })
export const updateProject = (id, body) =>
  request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(body) })
export const deleteProject = (id) =>
  request(`/projects/${id}`, { method: 'DELETE' })

export const getMonth = (year, month) =>
  request(`/movements/month/${year}-${String(month).padStart(2, '0')}`)
export const createMovement = (body) =>
  request('/movements', { method: 'POST', body: JSON.stringify(body) })
export const deleteMovement = (id) =>
  request(`/movements/${id}`, { method: 'DELETE' })

export const formatMoney = (value) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value || 0)

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })