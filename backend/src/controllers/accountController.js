import PersonalAccount from '../models/PersonalAccount.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const getAccounts = asyncHandler(async (req, res) => {
  const accounts = await PersonalAccount.find().sort({ createdAt: -1 })
  res.json(accounts)
})

export const createAccount = asyncHandler(async (req, res) => {
  const account = await PersonalAccount.create(req.body)
  res.status(201).json(account)
})

export const updateAccount = asyncHandler(async (req, res) => {
  const account = await PersonalAccount.findById(req.params.id)
  if (!account) {
    res.status(404)
    throw new Error('Cuenta no encontrada')
  }
  account.set(req.body)
  await account.save()
  res.json(account)
})

export const deleteAccount = asyncHandler(async (req, res) => {
  const account = await PersonalAccount.findByIdAndDelete(req.params.id)
  if (!account) {
    res.status(404)
    throw new Error('Cuenta no encontrada')
  }
  res.json({ message: 'Cuenta eliminada' })
})