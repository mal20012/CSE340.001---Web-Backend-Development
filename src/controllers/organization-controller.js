import { body, validationResult } from 'express-validator'
import { getOrganizationById } from '../models/organizations.js'
import { createOrganization } from '../models/organizations.js'
import { getProjectsByOrganizationId } from '../models/projects.js'

const organizationValidation = [
	body('name')
		.trim()
		.notEmpty().withMessage('Organization name is required.')
		.bail()
		.isLength({ min: 3, max: 150 }).withMessage('Organization name must be between 3 and 150 characters.')
		.escape(),
	body('description')
		.trim()
		.notEmpty().withMessage('Organization description is required.')
		.bail()
		.isLength({ max: 500 }).withMessage('Organization description cannot exceed 500 characters.')
		.escape(),
	body('contact_email')
		.trim()
		.notEmpty().withMessage('Contact email is required.')
		.bail()
		.isEmail().withMessage('Enter a valid email address.')
		.normalizeEmail(),
	body('logo_filename')
		.trim()
		.customSanitizer(value => value || 'placeholder-logo.png')
]

const showNewOrganizationForm = (req, res) => {
	res.render('new-organization', { title: 'Create New Organization' })
}

const processNewOrganizationForm = async(req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		errors.array().forEach(error => req.flash('error', error.msg))
		return res.redirect('/organizations/new')
	}

	try {
		const { name, description, contact_email, logo_filename } = req.body
		const organization = await createOrganization(
			name,
			description,
			contact_email,
			logo_filename
		)

		req.flash('success', 'Organization created successfully.')
		res.redirect(`/organization/${organization.organization_id}`)
	} catch (error) {
		next(error)
	}
}

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

export {
	organizationValidation,
	showNewOrganizationForm,
	processNewOrganizationForm,
	getOrganizationDetails
}