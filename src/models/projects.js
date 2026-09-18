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

<<<<<<< HEAD
const getProjectsByOrganizationId = async (organizationId) => {
      const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          date
        FROM projects
        WHERE organization_id = $1
        ORDER BY date;
      `;
      
      const queryParams = [organizationId];
      const result = await db.query(query, queryParams);

      return result.rows;
};

export { getAllProjects, getProjectsByOrganizationId };
=======
export { getAllProjects };
>>>>>>> origin/main
