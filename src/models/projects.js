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

export { getAllProjects }