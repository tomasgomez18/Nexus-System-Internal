const API = import.meta.env.VITE_API_URL || '/api'

const TIMEOUT = 10000

async function request(path, options = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT)
  let res
  try {
    res = await fetch(`${API}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      ...options,
    })
  } catch {
    throw new Error(
      'No se pudo conectar con el servidor. Revisá que el backend esté corriendo (npm run dev) y reintentá.'
    )
  } finally {
    clearTimeout(timer)
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

export const getAccounts = () => request('/accounts')
export const createAccount = (body) =>
  request('/accounts', { method: 'POST', body: JSON.stringify(body) })
export const updateAccount = (id, body) =>
  request(`/accounts/${id}`, { method: 'PUT', body: JSON.stringify(body) })
export const deleteAccount = (id) =>
  request(`/accounts/${id}`, { method: 'DELETE' })

export const formatMoney = (value) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value || 0)

export const formatDate = (date) => {
  const iso = typeof date === 'string' ? date : new Date(date).toISOString()
  const [y, m, d] = iso.slice(0, 10).split('-')
  return `${d}/${m}/${y}`
}