import bcrypt from 'bcrypt'
import { body, validationResult } from 'express-validator'
import { createUser } from '../models/users.js'

const registrationValidation = [
	body('name')
		.trim()
		.notEmpty().withMessage('Name is required.')
		.bail()
		.isLength({ max: 100 }).withMessage('Name must be 100 characters or fewer.'),
	body('email')
		.trim()
		.notEmpty().withMessage('Email is required.')
		.bail()
		.isEmail().withMessage('Enter a valid email address.')
		.bail()
		.isLength({ max: 100 }).withMessage('Email must be 100 characters or fewer.')
		.normalizeEmail(),
	body('password')
		.isString()
		.notEmpty().withMessage('Password is required.')
]

const showUserRegistrationForm = (req, res) => {
	res.render('register', { title: 'Register' })
}

const processUserRegistrationForm = async(req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		errors.array().forEach(error => req.flash('error', error.msg))
		return res.redirect('/register')
	}

	try {
		const { name, email, password } = req.body
		const passwordHash = await bcrypt.hash(password, 10)
		await createUser(name, email, passwordHash)

		req.flash('success', 'Registration successful! Please log in.')
		res.redirect('/')
	} catch (error) {
		if (error.code === '23505' && error.constraint === 'users_email_key') {
			req.flash('error', 'An account with that email already exists.')
			return res.redirect('/register')
		}
		next(error)
	}
}

export {
	registrationValidation,
	showUserRegistrationForm,
	processUserRegistrationForm
}
