import Movement from '../models/Movement.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { toLocalDate } from '../utils/date.js'

export const getMovements = asyncHandler(async (req, res) => {
  const movements = await Movement.find().sort({ date: -1 })
  res.json(movements)
})

export const getMonth = asyncHandler(async (req, res) => {
  const year = Number(req.params.year)
  const month = Number(req.params.month)
  const start = new Date(year, month - 1, 1)
  const end = new Date(year, month, 1)

  const movements = await Movement.find({ date: { $gte: start, $lt: end } }).sort({
    date: -1,
  })

  const ingresos = movements
    .filter((m) => m.type === 'ingreso')
    .reduce((sum, m) => sum + m.amount, 0)
  const egresos = movements
    .filter((m) => m.type === 'egreso')
    .reduce((sum, m) => sum + m.amount, 0)

  res.json({ year, month, ingresos, egresos, balance: ingresos - egresos, movements })
})

export const createMovement = asyncHandler(async (req, res) => {
  const movement = await Movement.create({
    ...req.body,
    date: toLocalDate(req.body.date) || new Date(),
  })
  res.status(201).json(movement)
})

export const deleteMovement = asyncHandler(async (req, res) => {
  const movement = await Movement.findByIdAndDelete(req.params.id)
  if (!movement) {
    res.status(404)
    throw new Error('Movimiento no encontrado')
  }
  res.json({ message: 'Movimiento eliminado' })
})