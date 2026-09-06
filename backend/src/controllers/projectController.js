import Project from '../models/Project.js'
import Movement from '../models/Movement.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { toLocalDate } from '../utils/date.js'

const syncInitialMovement = async (project) => {
  const existing = await Movement.findOne({
    projectId: project._id,
    category: 'pago-inicial',
  })

  if (!project.initialPayment) {
    if (existing) await existing.deleteOne()
    return
  }

  const data = {
    type: 'ingreso',
    concept: `Pago inicial - ${project.client}`,
    amount: project.initialPayment,
    date: project.startDate || new Date(),
    category: 'pago-inicial',
    projectId: project._id,
  }

  if (existing) {
    existing.set(data)
    await existing.save()
  } else {
    await Movement.create(data)
  }
}

const syncFinalMovement = async (project) => {
  const existing = await Movement.findOne({
    projectId: project._id,
    category: 'pago-final',
  })

  const remaining = (project.finalPrice || 0) - (project.initialPayment || 0)

  if (remaining <= 0) {
    if (existing) await existing.deleteOne()
    return
  }

  const data = {
    type: 'ingreso',
    concept: `Pago final - ${project.client}`,
    amount: remaining,
    date: project.endDate || new Date(),
    category: 'pago-final',
    projectId: project._id,
  }

  if (existing) {
    existing.set(data)
    await existing.save()
  } else {
    await Movement.create(data)
  }
}

export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 })
  res.json(projects)
})

export const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
  if (!project) {
    res.status(404)
    throw new Error('Proyecto no encontrado')
  }
  res.json(project)
})

export const createProject = asyncHandler(async (req, res) => {
  const body = {
    ...req.body,
    startDate: toLocalDate(req.body.startDate) || req.body.startDate,
    endDate: toLocalDate(req.body.endDate) || req.body.endDate,
  }
  const project = await Project.create(body)
  if (project.initialPayment > 0) await syncInitialMovement(project)
  if (project.status === 'finalizado') await syncFinalMovement(project)
  res.status(201).json(project)
})

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
  if (!project) {
    res.status(404)
    throw new Error('Proyecto no encontrado')
  }

  const becomingFinalized =
    project.status !== 'finalizado' &&
    req.body.status === 'finalizado' &&
    !project.finalizedIncomeCreated

  project.set({
    ...req.body,
    startDate: toLocalDate(req.body.startDate) || project.startDate,
    endDate: toLocalDate(req.body.endDate) || project.endDate,
  })

  if (becomingFinalized) project.finalizedIncomeCreated = true
  await project.save()

  await syncInitialMovement(project)
  if (project.status === 'finalizado') await syncFinalMovement(project)

  res.json(project)
})

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id)
  if (!project) {
    res.status(404)
    throw new Error('Proyecto no encontrado')
  }
  res.json({ message: 'Proyecto eliminado' })
})