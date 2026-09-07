import { Router } from 'express'
import {
  createAccount,
  deleteAccount,
  getAccounts,
  updateAccount,
} from '../controllers/accountController.js'

const router = Router()

router.route('/').get(getAccounts).post(createAccount)
router.route('/:id').put(updateAccount).delete(deleteAccount)

export default router