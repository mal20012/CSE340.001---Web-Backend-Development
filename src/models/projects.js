import db from './db.js'

const getAllProjects = async() => {
	const query = `
		SELECT
			p.project_id,
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

export { getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails }