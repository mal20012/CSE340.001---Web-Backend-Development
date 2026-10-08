import 'dotenv/config'
import express from 'express'
import session from 'express-session'
import path from 'path'
import { fileURLToPath } from 'url'
import { testConnection } from './src/models/db.js';
import categoryRoute from './src/routes/category-route.js'
import organizationRoute from './src/routes/organization-route.js'
import router from './src/routes/routes.js'
import flashMiddleware from './src/middleware/flash.js'

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = __dirname
const PORT = process.env.PORT || 3000
const NODE_ENV = process.env.NODE_ENV || 'development'
const SESSION_SECRET = process.env.SESSION_SECRET || 'development-secret'

app.set('view engine', 'ejs')
app.set('views', path.join(projectRoot, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(session({
	secret: SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: { secure: false }
}))
app.use(flashMiddleware)

// Middleware to log all incoming requests
app.use((req, res, next) => {
	if (NODE_ENV === 'development') {
		console.log(`${req.method} ${req.url}`)
	}
	next()
})

// Middleware to make environment and login state available to all templates
app.use((req, res, next) => {
	res.locals.NODE_ENV = NODE_ENV
	res.locals.isLoggedIn = Boolean(req.session?.user)
	next()
})

app.use(express.static(path.join(projectRoot, 'public')))
app.use('/category', categoryRoute)
app.use('/organization', organizationRoute)
app.use(router)

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