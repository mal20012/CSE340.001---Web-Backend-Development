import express from 'express'
import { getOrganizationDetails } from '../controllers/organization-controller.js'

const router = express.Router()

router.get('/:id', getOrganizationDetails)

export default router