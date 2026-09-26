import { getOrganizationById } from '../models/organizations.js'
import { getProjectsByOrganizationId } from '../models/projects.js'

const getOrganizationDetails = async(req, res, next) => {
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
}

export { getOrganizationDetails }