import 'dotenv/config'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { testConnection } from './src/models/db.js';
import { getAllOrganizations } from './src/models/organizations.js';
import { getAllCategories } from './src/models/categories.js';

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = __dirname
const PORT = process.env.PORT || 3000
const NODE_ENV = process.env.NODE_ENV || 'development'

app.set('view engine', 'ejs')
app.set('views', path.join(projectRoot, 'views'))
app.use(express.static(path.join(projectRoot, 'public')))

app.get('/', (req, res) => { res.render('index', { title: 'Home' }) })
app.get('/organizations', async (req, res) => {
	const organizations = await getAllOrganizations()

	const title = 'Our Partner Organizations'
	res.render('organizations', { title, organizations })
})
app.get('/projects', (req, res) => { res.render('projects', { title: 'Service Projects' }) })
app.get('/categories', async (req, res) => {
	const categories = await getAllCategories()

	const title = 'Service Project Categories'
	res.render('categories', { title, categories })
})
app.use((req, res) => { res.status(404).render('404', { title: 'Page Not Found' }) })
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