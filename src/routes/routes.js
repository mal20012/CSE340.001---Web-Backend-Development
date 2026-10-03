import express from 'express'
import { getAllOrganizations } from '../models/organizations.js'
import { getAllCategories } from '../models/categories.js'
import {
	projectValidation,
	showNewProjectForm,
	processNewProjectForm,
	showEditProjectForm,
	processEditProjectForm,
	getProjectsPage,
	getProjectDetailsPage
} from '../controllers/project-controller.js'
import {
	getOrganizationDetails,
	organizationValidation,
	showNewOrganizationForm,
	processNewOrganizationForm,
	showEditOrganizationForm,
	processEditOrganizationForm
} from '../controllers/organization-controller.js'
import {
	categoryValidation,
	showNewCategoryForm,
	processNewCategoryForm,
	showEditCategoryForm,
	processEditCategoryForm,
	showAssignCategoriesForm,
	processAssignCategoriesForm
} from '../controllers/category-controller.js'
import {
	registrationValidation,
	showUserRegistrationForm,
	processUserRegistrationForm
} from '../controllers/users.js'

const router = express.Router()

router.get('/', (req, res) => {
	res.render('index', { title: 'Home' })
})

router.get('/register', showUserRegistrationForm)
router.post('/register', registrationValidation, processUserRegistrationForm)

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

router.get('/organizations/new', showNewOrganizationForm)
router.post('/organizations', organizationValidation, processNewOrganizationForm)
router.get('/edit-organization/:id', showEditOrganizationForm)
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm)

router.get('/organization/:id', getOrganizationDetails)

router.get('/projects', getProjectsPage)
router.get('/new-project', showNewProjectForm)
router.post('/new-project', projectValidation, processNewProjectForm)
router.get('/edit-project/:id', showEditProjectForm)
router.post('/edit-project/:id', projectValidation, processEditProjectForm)
router.get('/project/:id', getProjectDetailsPage)
router.get('/assign-categories/:projectId', showAssignCategoriesForm)
router.post('/assign-categories/:projectId', processAssignCategoriesForm)

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

router.get('/new-category', showNewCategoryForm)
router.post('/new-category', categoryValidation, processNewCategoryForm)
router.get('/edit-category/:id', showEditCategoryForm)
router.post('/edit-category/:id', categoryValidation, processEditCategoryForm)

router.get('/test-error', (req, res, next) => {
	const err = new Error('This is a test error')
	err.status = 500
	next(err)
})

export default router
