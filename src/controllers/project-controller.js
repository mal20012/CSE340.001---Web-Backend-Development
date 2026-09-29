import { body, validationResult } from 'express-validator'
import { getAllProjects, getProjectDetails, createProject, updateProject } from '../models/projects.js'
import { getCategoriesByProjectId } from '../models/categories.js'
import { getAllOrganizations } from '../models/organizations.js'

const projectValidation = [
	body('title')
		.trim()
		.notEmpty().withMessage('Project title is required.')
		.bail()
		.isLength({ min: 3, max: 150 }).withMessage('Project title must be between 3 and 150 characters.')
		.escape(),
	body('description')
		.trim()
		.notEmpty().withMessage('Project description is required.')
		.bail()
		.isLength({ max: 999 }).withMessage('Project description must be fewer than 1000 characters.')
		.escape(),
	body('location')
		.trim()
		.notEmpty().withMessage('Project location is required.')
		.bail()
		.isLength({ max: 199 }).withMessage('Project location must be fewer than 200 characters.')
		.escape(),
	body('date')
		.trim()
		.notEmpty().withMessage('Project date is required.')
		.bail()
		.isISO8601({ strict: true }).withMessage('Enter a valid project date.')
		.toDate(),
	body('organizationId')
		.trim()
		.notEmpty().withMessage('Select an organization.')
		.bail()
		.isInt({ min: 1 }).withMessage('Select a valid organization.')
		.toInt()
]

const showNewProjectForm = async(req, res, next) => {
	try {
		const organizations = await getAllOrganizations()
		res.render('new-project', {
			title: 'Add New Service Project',
			organizations
		})
	} catch (error) {
		next(error)
	}
}

const processNewProjectForm = async(req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		errors.array().forEach(error => req.flash('error', error.msg))
		return res.redirect('/new-project')
	}

	try {
		const { title, description, location, date, organizationId } = req.body
		await createProject(title, description, location, date, organizationId)
		req.flash('success', 'New service project created successfully!')
		res.redirect('/projects')
	} catch (error) {
		console.error('Error creating new project:', error)
		req.flash('error', 'There was an error creating the service project.')
		return res.redirect('/new-project')
	}
}

const showEditProjectForm = async(req, res, next) => {
	try {
		const projectId = Number.parseInt(req.params.id, 10)
		if (!Number.isInteger(projectId) || projectId < 1) {
			const err = new Error('Project Not Found')
			err.status = 404
			return next(err)
		}

		const [project, organizations] = await Promise.all([
			getProjectDetails(projectId),
			getAllOrganizations()
		])

		if (!project) {
			const err = new Error('Project Not Found')
			err.status = 404
			return next(err)
		}

		res.render('update-project', {
			title: 'Edit Service Project',
			project,
			organizations
		})
	} catch (error) {
		next(error)
	}
}

const processEditProjectForm = async(req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		errors.array().forEach(error => req.flash('error', error.msg))
		return res.redirect(`/edit-project/${req.params.id}`)
	}

	try {
		const projectId = Number.parseInt(req.params.id, 10)
		if (!Number.isInteger(projectId) || projectId < 1) {
			const err = new Error('Project Not Found')
			err.status = 404
			return next(err)
		}

		const { title, description, location, date, organizationId } = req.body
		await updateProject(projectId, title, description, location, date, organizationId)
		req.flash('success', 'Service project updated successfully.')
		res.redirect(`/project/${projectId}`)
	} catch (error) {
		console.error('Error updating service project:', error)
		req.flash('error', 'There was an error updating the service project.')
		res.redirect(`/edit-project/${req.params.id}`)
	}
}

const getProjectsPage = async(req, res, next) => {
	try {
		const projects = await getAllProjects()
		res.render('projects', {
			title: 'Service Projects',
			projects
		})
	} catch (error) {
		next(error)
	}
}

const getProjectDetailsPage = async(req, res, next) => {
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

		res.render('project', {
			title: project.title,
			project,
			categories
		})
	} catch (error) {
		next(error)
	}
}

export {
	projectValidation,
	showNewProjectForm,
	processNewProjectForm,
	showEditProjectForm,
	processEditProjectForm,
	getProjectsPage,
	getProjectDetailsPage
}
