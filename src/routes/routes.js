import express from 'express'
import { getAllOrganizations, getOrganizationById } from '../models/organizations.js'
import { getAllCategories } from '../models/categories.js'
import { getProjectsPage, getProjectDetailsPage } from '../controllers/project-controller.js'
import { getOrganizationDetails } from '../controllers/organization-controller.js'

const router = express.Router()

router.get('/', (req, res) => {
	res.render('index', { title: 'Home' })
})

router.get('/organizations', async (req, res, next) => {
	try {
		const organizations = await getAllOrganizations()
		res.render('organizations', {
			title: 'Our Partner Organizations',
			organizations
		})
	} catch (error) {
		next(error)
	}
})

router.get('/organization/:id', getOrganizationDetails)

router.get('/projects', getProjectsPage)
router.get('/project/:id', getProjectDetailsPage)

router.get('/categories', async (req, res, next) => {
	try {
		const categories = await getAllCategories()
		res.render('categories', {
			title: 'Service Project Categories',
			categories
		})
	} catch (error) {
		next(error)
	}
})

router.get('/test-error', (req, res, next) => {
	const err = new Error('This is a test error')
	err.status = 500
	next(err)
})

export default router
