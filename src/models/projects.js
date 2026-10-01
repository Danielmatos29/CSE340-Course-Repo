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
    return result.rows.length > 0 ? result.rows : null
};

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

const getUpcomingProjects = async(number_of_projects) => {
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
    ON p.organization_id = o.organization_id
    WHERE p.date >= CURRENT_DATE
    ORDER BY p.date ASC
    LIMIT $1;`;
  
    const queryParams = [number_of_projects];
    const result = await db.query(query, queryParams);

    return result.rows.length > 0 ? result.rows : null;
}

const getProjectDetails = async(id) => {
    const query = `SELECT 
    p.project_id,
    p.title,
    p.description,
    p.location,
    TO_CHAR (p.date, 'YYYY-MM-DD') AS date,
    o.organization_id,
    o.name
    FROM projects p
    LEFT JOIN organizations o 
    ON p.organization_id = o.organization_id
    WHERE p.project_id = $1;`;

    const queryParams = [id];
    const result = await db.query(query, queryParams);


    return result.rows.length > 0 ? result.rows[0] : null;
}

const createProject = async(title, description, location, date, organizationId) => {
  const query = `
  INSERT INTO projects(title, description, location, date, organization_id)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING project_id;
  `;

  const queryParams = [title, description, location, date, organizationId];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0)
    throw new Error('Failed to create project');
  
  if (process.env.ENABLE_SQL_LOGGING === 'true')
    console.log('Created project with ID:', result.rows[0].project_id);

  return result.rows[0].project_id;
}

const updateProject = async (project_id, title, description, location, date, organization_id) => {
  const query =  `
  UPDATE projects
  SET title = $1, description = $2, location = $3, date = $4, organization_id = $5
  WHERE project_id = $6
  RETURNING project_id
  `;

  const queryParams = [title, description, location, date, organization_id, project_id];

  const result = await db.query(query, queryParams);

  if (result.rows.length === 0)
    throw new Error('Project could not be updated!');

  if (process.env.ENABLE_SQL_LOGGING === 'true')
    console.log('Updated project with ID: ', project_id);

  return result.rows[0].project_id;
}
export { 
  getAllProjects, 
  getProjectsByOrganizationId, 
  getUpcomingProjects, 
  getProjectDetails,
  createProject,
  updateProject
};
