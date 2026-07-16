import 'dotenv/config'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const port = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => { res.render('index', { title: 'Home' }) })
app.get('/organizations', (req, res) => { res.render('organizations', { title: 'Organizations' }) })
app.get('/projects', (req, res) => { res.render('projects', { title: 'Service Projects' }) })
app.get('/categories', (req, res) => { res.render('categories', { title: 'Categories' }) })
app.use((req, res) => { res.status(404).render('404', { title: 'Page Not Found' }) })
app.listen(port, () => { console.log(`Service Project Hub is running on port ${port}`) })
