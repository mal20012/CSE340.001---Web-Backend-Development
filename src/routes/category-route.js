import express from 'express'
import { getCategoryDetails } from '../controllers/category-controller.js'

const router = express.Router()

router.get('/:id', getCategoryDetails)

export default router
