import express from 'express'
import { getAllOrganizations } from '../models/organizations.js'
import { getAllCategories } from '../models/categories.js'
import { getProjectsPage, getProjectDetailsPage } from '../controllers/project-controller.js'
import { getOrganizationDetails } from '../controllers/organization-controller.js'
import db from '../models/db.js'

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

router.get('/organizations/new', (req, res) => {
	res.render('new-organization', { title: 'Create New Organization' })
})

router.post('/organizations', async (req, res, next) => {
	try {
		const { name, description, contact_email, logo_filename } = req.body

		const result = await db.query(
			`INSERT INTO public.organization (name, description, contact_email, logo_filename)
			 VALUES ($1, $2, $3, $4)
			 RETURNING organization_id;`,
			[name, description, contact_email, logo_filename || 'placeholder-logo.png']
		)

		const organizationId = result.rows[0].organization_id
		req.flash('success', 'Organization created successfully.')
		res.redirect(`/organization/${organizationId}`)
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
