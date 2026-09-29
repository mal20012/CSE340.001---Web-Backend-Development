import { body, validationResult } from 'express-validator'
import {
	getCategoryById,
	createCategory,
	updateCategory,
	getProjectsByCategoryId,
	getAllCategories,
	getCategoriesByProjectId,
	updateCategoryAssignments
} from '../models/categories.js'
import { getProjectDetails } from '../models/projects.js'

const categoryValidation = [
	body('name')
		.trim()
		.notEmpty().withMessage('Category name is required.')
		.bail()
		.isLength({ min: 3, max: 100 }).withMessage('Category name must be between 3 and 100 characters.')
]

const showNewCategoryForm = (req, res) => {
	res.render('new-category', { title: 'Create New Category' })
}

const processNewCategoryForm = async(req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		errors.array().forEach(error => req.flash('error', error.msg))
		return res.redirect('/new-category')
	}

	try {
		const categoryId = await createCategory(req.body.name)
		req.flash('success', 'Category created successfully.')
		res.redirect(`/category/${categoryId}`)
	} catch (error) {
		if (error.code === '23505') {
			req.flash('error', 'A category with that name already exists.')
			return res.redirect('/new-category')
		}
		next(error)
	}
}

const showEditCategoryForm = async(req, res, next) => {
	try {
		const categoryId = Number.parseInt(req.params.id, 10)
		if (!Number.isInteger(categoryId) || categoryId < 1) {
			const err = new Error('Category Not Found')
			err.status = 404
			return next(err)
		}

		const category = await getCategoryById(categoryId)
		if (!category) {
			const err = new Error('Category Not Found')
			err.status = 404
			return next(err)
		}

		res.render('edit-category', { title: 'Edit Category', category })
	} catch (error) {
		next(error)
	}
}

const processEditCategoryForm = async(req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		errors.array().forEach(error => req.flash('error', error.msg))
		return res.redirect(`/edit-category/${req.params.id}`)
	}

	try {
		const categoryId = Number.parseInt(req.params.id, 10)
		if (!Number.isInteger(categoryId) || categoryId < 1) {
			const err = new Error('Category Not Found')
			err.status = 404
			return next(err)
		}

		await updateCategory(categoryId, req.body.name)
		req.flash('success', 'Category updated successfully.')
		res.redirect(`/category/${categoryId}`)
	} catch (error) {
		if (error.code === '23505') {
			req.flash('error', 'A category with that name already exists.')
			return res.redirect(`/edit-category/${req.params.id}`)
		}
		next(error)
	}
}

const getCategoryDetails = async(req, res, next) => {
	try {
		const categoryId = Number.parseInt(req.params.id, 10)

		if (!Number.isInteger(categoryId) || categoryId < 1) {
			const err = new Error('Category Not Found')
			err.status = 404
			return next(err)
		}

		const [category, projects] = await Promise.all([
			getCategoryById(categoryId),
			getProjectsByCategoryId(categoryId)
		])

		if (!category) {
			const err = new Error('Category Not Found')
			err.status = 404
			return next(err)
		}

		res.render('category', {
			title: category.name,
			category,
			projects
		})
	} catch (error) {
		next(error)
	}
}

const showAssignCategoriesForm = async(req, res, next) => {
	try {
		const projectId = Number.parseInt(req.params.projectId, 10)
		if (!Number.isInteger(projectId) || projectId < 1) {
			const err = new Error('Project Not Found')
			err.status = 404
			return next(err)
		}

		const [projectDetails, categories, assignedCategories] = await Promise.all([
			getProjectDetails(projectId),
			getAllCategories(),
			getCategoriesByProjectId(projectId)
		])

		if (!projectDetails) {
			const err = new Error('Project Not Found')
			err.status = 404
			return next(err)
		}

		res.render('assign-categories', {
			title: 'Assign Categories to Project',
			projectId,
			projectDetails,
			categories,
			assignedCategories
		})
	} catch (error) {
		next(error)
	}
}

const processAssignCategoriesForm = async(req, res, next) => {
	try {
		const projectId = Number.parseInt(req.params.projectId, 10)
		if (!Number.isInteger(projectId) || projectId < 1) {
			const err = new Error('Project Not Found')
			err.status = 404
			return next(err)
		}

		const project = await getProjectDetails(projectId)
		if (!project) {
			const err = new Error('Project Not Found')
			err.status = 404
			return next(err)
		}

		const submittedIds = req.body.categoryIds ?? []
		const categoryIds = (Array.isArray(submittedIds) ? submittedIds : [submittedIds])
			.map(value => Number(value))

		if (categoryIds.some(categoryId => !Number.isSafeInteger(categoryId) || categoryId < 1)) {
			req.flash('error', 'Select valid categories.')
			return res.redirect(`/assign-categories/${projectId}`)
		}

		await updateCategoryAssignments(projectId, categoryIds)
		req.flash('success', 'Categories updated successfully.')
		res.redirect(`/project/${projectId}`)
	} catch (error) {
		next(error)
	}
}

export {
	categoryValidation,
	showNewCategoryForm,
	processNewCategoryForm,
	showEditCategoryForm,
	processEditCategoryForm,
	getCategoryDetails,
	showAssignCategoriesForm,
	processAssignCategoriesForm
}
