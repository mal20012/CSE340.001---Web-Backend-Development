import db from './db.js'

const getAllProjects = async() => {
	const query = `
		SELECT
			p.project_id,
			p.organization_id,
			p.title,
			p.description,
			p.location,
			p.date,
			o.name AS organization_name,
			STRING_AGG(c.name, ', ' ORDER BY c.name) AS categories
		FROM public.project AS p
		JOIN public.organization AS o
			ON p.organization_id = o.organization_id
		LEFT JOIN public.project_category AS pc
			ON p.project_id = pc.project_id
		LEFT JOIN public.category AS c
			ON pc.category_id = c.category_id
		GROUP BY p.project_id, p.title, p.description, p.location, p.date, o.name
		ORDER BY p.date, p.project_id;
	`

	const result = await db.query(query)

	return result.rows
}

const createProject = async(title, description, location, date, organizationId) => {
	const query = `
		INSERT INTO public.project (title, description, location, date, organization_id)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING project_id;
	`
	const result = await db.query(query, [title, description, location, date, organizationId])

	if (result.rows.length === 0) {
		throw new Error('Failed to create project')
	}

	return result.rows[0].project_id
}

const updateProject = async(projectId, title, description, location, date, organizationId) => {
	const query = `
		UPDATE public.project
		SET title = $2,
			description = $3,
			location = $4,
			date = $5,
			organization_id = $6
		WHERE project_id = $1
		RETURNING project_id;
	`
	const result = await db.query(query, [projectId, title, description, location, date, organizationId])

	if (result.rows.length === 0) {
		throw new Error('Failed to update project')
	}

	return result.rows[0].project_id
}

const getProjectsByOrganizationId = async(organizationId) => {
	const query = `
		SELECT project_id, title, description, location, date
		FROM public.project
		WHERE organization_id = $1
		ORDER BY date, project_id;
	`

	const result = await db.query(query, [organizationId])

	return result.rows
}

const getUpcomingProjects = async(numberOfProjects) => {
	const query = `
		SELECT
			p.project_id,
			p.title,
			p.description,
			p.date,
			p.location,
			p.organization_id,
			o.name AS organization_name
		FROM public.project AS p
		JOIN public.organization AS o
			ON p.organization_id = o.organization_id
		WHERE p.date >= CURRENT_DATE
		ORDER BY p.date, p.project_id
		LIMIT $1;
	`

	const result = await db.query(query, [numberOfProjects])

	return result.rows
}

const getProjectDetails = async(projectId) => {
	const query = `
		SELECT
			p.project_id,
			p.title,
			p.description,
			p.date,
			p.location,
			p.organization_id,
			o.name AS organization_name
		FROM public.project AS p
		JOIN public.organization AS o
			ON p.organization_id = o.organization_id
		WHERE p.project_id = $1;
	`

	const result = await db.query(query, [projectId])

	return result.rows[0]
}

export { getAllProjects, createProject, updateProject, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails }