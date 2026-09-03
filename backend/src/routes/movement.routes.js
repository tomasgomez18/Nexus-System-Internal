import { Router } from 'express'
import {
  createMovement,
  deleteMovement,
  getMonth,
  getMovements,
} from '../controllers/movementController.js'

const router = Router()

router.route('/').get(getMovements).post(createMovement)
router.get('/month/:year-:month', getMonth)
router.route('/:id').delete(deleteMovement)

export default router