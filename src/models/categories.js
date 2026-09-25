import db from './db.js'

const getAllCategories = async() => {
    const result = await db.query(`
        SELECT category_id, name
        FROM public.category
        ORDER BY name;
    `)
    return result.rows
}

const getCategoryById = async(categoryId) => {
    const result = await db.query(`
        SELECT category_id, name
        FROM public.category
        WHERE category_id = $1;
    `, [categoryId])
    return result.rows[0]
}

const getCategoriesByProjectId = async(projectId) => {
    const result = await db.query(`
        SELECT c.category_id, c.name
        FROM public.category c
        JOIN public.project_category pc
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name;
    `, [projectId])
    return result.rows
}

const getProjectsByCategoryId = async(categoryId) => {
    const result = await db.query(`
        SELECT p.project_id, p.title
        FROM public.project p
        JOIN public.project_category pc
            ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.date, p.project_id;
    `, [categoryId])
    return result.rows
}

export {
    getAllCategories,
    getCategoryById,
    getCategoriesByProjectId,
    getProjectsByCategoryId
}