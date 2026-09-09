import db from "./db.js"

const getAllCategories = async() => {
    const query = `SELECT category_id, category_name, project_id
    FROM public.categories WHERE category_id IN (1, 3, 5)`

    const result = await db.query(query)

    return result.rows
}

export { getAllCategories }