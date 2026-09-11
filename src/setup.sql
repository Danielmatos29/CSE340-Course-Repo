CREATE TABLE organizations (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organizations(name, description, contact_email, logo_filename)
VALUES ('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 
'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 
'hello@unityserve.org', 'unityserve-logo.png');

CREATE TABLE projects (
	project_id SERIAL PRIMARY KEY,
	organization_id INTEGER REFERENCES organizations(organization_id),
	title VARCHAR(80) NOT NULL,
	description TEXT NOT NULL,
	location VARCHAR(255) NOT NULL,
	"date" DATE NOT NULL
);

INSERT INTO projects (title, description, location, "date", organization_id)
VALUES ('Food Bank Inventory Tracker', 'Track donations of canned goods, expiration dates, and distribution schedules.', 
'Rexburg Community Center, 200 S 1st E', '2024-01-15',
 1),
('Emergency Food Pantry',
 'Weekly food distribution for low-income families in the community.',
 'Library Room 304, BYU-Idaho Campus', '2025-05-28',
 1);

INSERT INTO projects (title, description, location, "date", organization_id) 
VALUES 
('Student Tutoring Program', 
 'Connect students needing help with math, science, or languages to volunteer tutors.',
 'HBLL Room 264 (Library Learning Center)', '2024-04-07',
 2),

('Senior Tech Support', 
 'Teach seniors how to use smartphones, tablets, and computers.',
 'Rexburg Senior Center, 150 N 4th E', '2026-03-12',
 2);

INSERT INTO projects (title, description, location, "date", organization_id) 
VALUES 
('Campus Community Garden', 
 'Manage plot assignments, planting schedules, and harvest tracking.',
 'East of Manwaring Center, Plot Area B', '2026-05-18',
 3),

('Youth Green Thumb Club', 
 'After-school gardening program for middle and high school students.',
 'Rexburg City Park Community Garden', '2025-06-02',
 3);

CREATE TABLE categories (
	category_id SERIAL PRIMARY KEY,
	category_name VARCHAR(150) NOT NULL,
);

INSERT INTO categories (category_name)
VALUES 
	('Food Security & Hunger Relief'),
	('Education & Technology Support'),
	('Sustainability & Community Gardening'),
	('Health & Wellness Outreach'),
	('Youth Development & Mentorship');

-- Junction table added for many-to-many relationship in project and categories
CREATE TABLE project_has_categories (
	category_id INTEGER REFERENCES categories(category_id) ON DELETE CASCADE,
	project_id INTEGER REFERENCES projects(project_id) ON DELETE CASCADE,
	PRIMARY KEY (category_id, project_id)
);

INSERT INTO project_has_categories (category_id, project_id)
VALUES (1, 1), (1, 2),
       (2, 3), (2, 4),
       (3, 5), (3, 6),
	   (4, 1), (4, 2),
       (5, 3), (5, 4);