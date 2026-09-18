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
'Rexburg Community Center, 200 S 1st E', '2027-01-15',
 1),
('Emergency Food Pantry',
 'Weekly food distribution for low-income families in the community.',
 'Library Room 304, BYU-Idaho Campus', '2027-05-28',
 1),
('Student Tutoring Program', 
 'Connect students needing help with math, science, or languages to volunteer tutors.',
 'HBLL Room 264 (Library Learning Center)', '2027-04-07',
 1),

('Senior Tech Support', 
 'Teach seniors how to use smartphones, tablets, and computers.',
 'Rexburg Senior Center, 150 N 4th E', '2027-03-12',
 1),
('Campus Community Garden', 
 'Manage plot assignments, planting schedules, and harvest tracking.',
 'East of Manwaring Center, Plot Area B', '2027-05-18',
 1),

('Youth Green Thumb Club', 
 'After-school gardening program for middle and high school students.',
 'Rexburg City Park Community Garden', '2027-06-02',
 1),
 ('Digital Literacy Workshop',
 'Teach basic computer skills and internet safety to community members.',
 'Rexburg Public Library, 39 E Main St', '2026-09-15',
 2),
('Coding Bootcamp for Teens',
 'Introduce high school students to programming fundamentals using Python.',
 'HBLL Room 150, BYU-Idaho Campus', '2026-10-01',
 2),
('Math Tutoring Fair',
 'Open tutoring event for students struggling with algebra and calculus.',
 'Manwaring Center Ballroom, BYU-Idaho', '2026-11-05',
 2),
('Science Mentorship Program',
 'Pair college volunteers with middle school students for hands-on science experiments.',
 'Rexburg Middle School, 365 W 4th S', '2026-12-10',
 2),
('Language Exchange Program',
 'Connect native English speakers with international students for language practice.',
 'BYU-Idaho International Center, Room 201', '2027-01-20',
 2),

('Community Composting Initiative',
 'Educate residents on composting techniques and manage community compost bins.',
 'Rexburg City Park, North Section', '2026-09-22',
 3),
('Urban Beekeeping Workshop',
 'Train volunteers on sustainable beekeeping practices to support local pollination.',
 'East Campus Agricultural Area, BYU-Idaho', '2026-10-15',
 3),
('Fall Harvest Festival',
 'Community event celebrating local produce with cooking demos and garden tours.',
 'Rexburg Farmers Market, Center St', '2026-11-01',
 3),
('Water Conservation Garden',
 'Design and maintain a drought-resistant demonstration garden for the community.',
 'Rexburg City Hall Grounds, 35 N 1st E', '2026-12-05',
 3),
('School Garden Curriculum',
 'Develop and teach a garden-based science curriculum for local elementary schools.',
 'Jefferson Elementary School, 280 W 4th S', '2027-02-10',
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