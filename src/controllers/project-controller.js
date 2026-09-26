import { getProjectDetails, getUpcomingProjects } from '../models/projects.js'
import { getCategoriesByProjectId } from '../models/categories.js'

const getProjectsPage = async(req, res, next) => {
	try {
		const projects = await getUpcomingProjects(5)
		res.render('projects', {
			title: 'Upcoming Service Projects',
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

export { getProjectsPage, getProjectDetailsPage }
