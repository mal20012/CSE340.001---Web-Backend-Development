import 'dotenv/config'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { testConnection } from './src/models/db.js';
import { getAllOrganizations, getOrganizationById } from './src/models/organizations.js';
// ...existing code...
import {
    getAllCategories,
    getCategoriesByProjectId
} from './src/models/categories.js'
import {
	getProjectsByOrganizationId,
	getUpcomingProjects,
	getProjectDetails
} from './src/models/projects.js'
import categoryRoute from './src/routes/category-route.js'

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = __dirname
const PORT = process.env.PORT || 3000
const NODE_ENV = process.env.NODE_ENV || 'development'

app.set('view engine', 'ejs')
app.set('views', path.join(projectRoot, 'views'))

// Middleware to log all incoming requests
app.use((req, res, next) => {
	if (NODE_ENV === 'development') {
		console.log(`${req.method} ${req.url}`)
	}
	next()
})

// Middleware to make NODE_ENV available to all templates
app.use((req, res, next) => {
	res.locals.NODE_ENV = NODE_ENV
	next()
})

app.use(express.static(path.join(projectRoot, 'public')))
app.use('/category', categoryRoute)

app.get('/', (req, res) => { res.render('index', { title: 'Home' }) })
app.get('/organizations', async (req, res) => {
	const organizations = await getAllOrganizations()

	const title = 'Our Partner Organizations'
	res.render('organizations', { title, organizations })
})
app.get('/organization/:id', async (req, res, next) => {
	try {
		const organizationId = Number.parseInt(req.params.id, 10)
		if (!Number.isInteger(organizationId) || organizationId < 1) {
			const err = new Error('Organization Not Found')
			err.status = 404
			return next(err)
		}

		const [organization, projects] = await Promise.all([
			getOrganizationById(organizationId),
			getProjectsByOrganizationId(organizationId)
		])

		if (!organization) {
			const err = new Error('Organization Not Found')
			err.status = 404
			return next(err)
		}

		res.render('organization', {
			title: organization.name,
			organization,
			projects
		})
	} catch (error) {
		next(error)
	}
})
app.get('/projects', async (req, res) => {
	const projects = await getUpcomingProjects(5)

	const title = 'Upcoming Service Projects'
	res.render('projects', { title, projects })
})
app.get('/project/:id', async (req, res, next) => {
	try {
		const projectId = Number.parseInt(req.params.id, 10)
		if (!Number.isInteger(projectId) || projectId < 1) {
			const err = new Error('Project Not Found')
			err.status = 404
			return next(err)
		}

		const [project, categories] = await Promise.all([
			getProjectDetails(projectId),
			getCategoriesByProjectId(projectId)
		])
		if (!project) {
			const err = new Error('Project Not Found')
			err.status = 404
			return next(err)
		}

		res.render('project', { title: project.title, project, categories })
	} catch (error) {
		next(error)
	}
})
app.get('/categories', async (req, res) => {
	const categories = await getAllCategories()

	const title = 'Service Project Categories'
	res.render('categories', { title, categories })
})

// Test route for 500 errors
app.get('/test-error', (req, res, next) => {
	const err = new Error('This is a test error')
	err.status = 500
	next(err)
})

// Catch-all route for 404 errors
app.use((req, res, next) => {
	const err = new Error('Page Not Found')
	err.status = 404
	next(err)
})

// Global error handler
app.use((err, req, res, next) => {
	console.error('Error occurred:', err.message)
	console.error('Stack trace:', err.stack)

	const status = err.status || 500
	const template = status === 404 ? '404' : '500'
	const context = {
		title: status === 404 ? 'Page Not Found' : 'Server Error',
		error: err.message,
		stack: err.stack,
		NODE_ENV
	}

	res.status(status).render(`errors/${template}`, context)
})

app.listen(PORT, async () => {
	try {
		await testConnection()
		console.log(`Server is running at http://127.0.0.1:${PORT}`)
		console.log(`Environment: ${NODE_ENV}`)
	} catch (error) {
		console.error('Error connecting to the database:', error)
        process.exit(1) // Exit with the failure code
	}
})