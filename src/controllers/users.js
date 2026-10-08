import bcrypt from 'bcrypt'
import { body, validationResult } from 'express-validator'
import { authenticateUser, createUser } from '../models/users.js'

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

const loginValidation = [
	body('email')
		.trim()
		.notEmpty().withMessage('Email is required.')
		.bail()
		.isEmail().withMessage('Enter a valid email address.')
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
		res.redirect('/login')
	} catch (error) {
		if (error.code === '23505' && error.constraint === 'users_email_key') {
			req.flash('error', 'An account with that email already exists.')
			return res.redirect('/register')
		}
		next(error)
	}
}

const showLoginForm = (req, res) => {
	res.render('login', { title: 'Login' })
}

const requireLogin = (req, res, next) => {
	if (!req.session?.user) {
		req.flash('error', 'You must be logged in to access that page.')
		return res.redirect('/login')
	}

	next()
}

const showDashboard = (req, res) => {
	const { name, email } = req.session.user
	res.render('dashboard', {
		title: 'Dashboard',
		name,
		email
	})
}

const processLoginForm = async(req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		errors.array().forEach(error => req.flash('error', error.msg))
		return res.redirect('/login')
	}

	try {
		const { email, password } = req.body
		const user = await authenticateUser(email, password)
		if (!user) {
			req.flash('error', 'Invalid email or password.')
			return res.redirect('/login')
		}

		req.session.user = user
		req.flash('success', 'Login successful!')
		if (res.locals.NODE_ENV === 'development') {
			console.log('User logged in:', user)
		}
		return res.redirect('/dashboard')
	} catch (error) {
		next(error)
	}
}

const processLogout = (req, res) => {
	if (req.session) {
		delete req.session.user
	}
	req.flash('success', 'Logout successful!')
	return res.redirect('/login')
}

export {
	registrationValidation,
	showUserRegistrationForm,
	processUserRegistrationForm,
	loginValidation,
	showLoginForm,
	processLoginForm,
	processLogout,
	requireLogin,
	showDashboard
}
