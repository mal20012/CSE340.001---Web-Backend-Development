import {
	getCategoryById,
	getProjectsByCategoryId
} from '../models/categories.js'

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

export { getCategoryDetails }
