import db from './db.js';

const getAllProjects = async() => {
    const query = `SELECT 
    p.project_id,
    p.title,
    p.description,
    p.location,
    TO_CHAR (p.date, 'YYYY-MM-DD') AS date,
    o.organization_id,
    o.name
    FROM projects p
    JOIN organizations o 
    ON p.organization_id = o.organization_id;`;

    const result = await db.query(query)
    return result.rows
};

export { getAllProjects };