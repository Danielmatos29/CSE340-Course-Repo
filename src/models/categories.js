import db from "./db.js"

const getAllCategories = async() => {
    const query = `SELECT category_id, category_name
    FROM categories`

    const result = await db.query(query)

    return result.rows.length > 0 ? result.rows : null
}

const getCategoriesByID = async(categoryID) => {
    const query = `SELECT category_id, category_name
    FROM categories
    WHERE category_id = $1`

    const queryParams = [categoryID];

    const result = await db.query(query, queryParams)

    return result.rows.length > 0 ? result.rows[0] : null
}

const getCategoriesByProjectId = async (projectId) => {
    const query = `SELECT categories.category_id, categories.category_name
    FROM categories
    JOIN project_has_categories ON project_has_categories.category_id = categories.category_id
    WHERE project_has_categories.project_id = $1`;

    const queryParams = [projectId];

    const result = await db.query(query, queryParams);

    return result.rows.length > 0 ? result.rows : null;
};

const getProjectsByCategoryId = async (categoryID) => {
    const query = `SELECT projects.project_id, projects.title, projects.description, projects.location, projects.date
    FROM projects
    JOIN project_has_categories ON project_has_categories.project_id = projects.project_id
    WHERE project_has_categories.category_id = $1`;

    const queryParams = [categoryID];

    const result = await db.query(query, queryParams);

    return result.rows.length > 0 ? result.rows : null;
};
export { getAllCategories, getCategoriesByID, getProjectsByCategoryId, getCategoriesByProjectId }