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

const createCategory = async(name) => {
    const result = await db.query(`
        INSERT INTO public.category (name)
        VALUES ($1)
        RETURNING category_id;
    `, [name])

    if (!result.rows.length) {
        throw new Error('Failed to create category')
    }

    return result.rows[0].category_id
}

const updateCategory = async(categoryId, name) => {
    const result = await db.query(`
        UPDATE public.category
        SET name = $2
        WHERE category_id = $1
        RETURNING category_id;
    `, [categoryId, name])

    if (!result.rows.length) {
        throw new Error('Failed to update category')
    }

    return result.rows[0].category_id
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

const assignCategoryToProject = async(projectId, categoryId) => {
    await db.query(`
        INSERT INTO public.project_category (project_id, category_id)
        VALUES ($1, $2);
    `, [projectId, categoryId])
}

const updateCategoryAssignments = async(projectId, categoryIds) => {
    await db.query(`
        DELETE FROM public.project_category
        WHERE project_id = $1;
    `, [projectId])

    for (const categoryId of [...new Set(categoryIds)]) {
        await assignCategoryToProject(projectId, categoryId)
    }
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
    createCategory,
    updateCategory,
    getCategoriesByProjectId,
    getProjectsByCategoryId,
    updateCategoryAssignments
}