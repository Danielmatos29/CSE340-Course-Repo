import db from './db.js';
import bcrypt from 'bcrypt';

const createUser = async(name, passwordHash, email) => {
    const default_role = 'user';
    const query = `
    INSERT INTO users (name, email, password_hash, role_id)
    VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4))
    RETURNING user_id;
    `;

    const querParams = [name, email, passwordHash, default_role];

    const result = await db.query(query, querParams);

    if (result.rows.length === 0){
        throw new Error("Failed to create user")
    }
    if (process.env.ENABLE_SQL_LOGGING === 'true'){
        console.log('Created new user with ID: ', result.rows[0].user_id)
    }

    return result.rows[0].user_id;
}

const findUserByEmail = async (email) => {
    const query = `
        SELECT u.user_id, u.name, u.email, u.password_hash, r.role_name 
        FROM users u
        JOIN roles r  ON r.role_id = u.role_id
        WHERE email = $1
    `;
    const queryParams = [email];
    
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        return null; // User not found
    }
    
    return result.rows[0];
};

const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email)
    if (!user){
        return null
    };

    const isValid = await verifyPassword(password, user.password_hash)
    if (!isValid){
        return null
    };

    delete user.password_hash;
    return user;
}

const getAllUsers = async() => {
    const query = `
    SELECT u.user_id, u.name, u.email, r.role_name
    FROM users u
    JOIN roles r ON u.role_id = r.role_id;
    `;

    const result = await db.query(query);

    return result.rows.length > 0 ? result.rows : null;
}

const volunteerForProject = async(userId, projectId) => {
    const query = `
    INSERT INTO project_volunteers (project_id, user_id)
    VALUES ($1, $2)
    RETURNING project_id, user_id;
    `;

    const queryParams = [projectId, userId];
    const result = await db.query(query, queryParams);

    return result.rows.length > 0 ? result.rows[0] : null;
}

const deleteVolunteerForProject = async(userId, projectId) => {
    const query = `
    DELETE FROM project_volunteers
    WHERE project_id = $1 AND user_id = $2
    RETURNING project_id, user_id;
    `;

    const queryParams = [projectId, userId];
    const result = await db.query(query, queryParams);
    
    return result.rows.length > 0 ? result.rows[0] : null;
}

const getVolunteersByUsers = async(userId) => {
    const query = `
    SELECT pv.project_id, pv.user_id, p.title
    FROM project_volunteers pv
    JOIN projects p ON pv.project_id = p.project_id
    WHERE pv.user_id = $1;
    `;

    const queryParams = [userId];
    const result = await db.query(query, queryParams);

    return result.rows.length > 0 ? result.rows : null;
}

export { 
    createUser,
    authenticateUser,
    getAllUsers,
    volunteerForProject,
    deleteVolunteerForProject,
    getVolunteersByUsers
  }