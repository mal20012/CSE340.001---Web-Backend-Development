
-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders',
 'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
 'info@brightfuturebuilders.org',
 'brightfuture-logo.png'),

('GreenHarvest Growers',
 'An urban farming collective promoting food sustainability and education in local neighborhoods.',
 'contact@greenharvest.org',
 'greenharvest-logo.png'),

('UnityServe Volunteers',
 'A volunteer coordination group supporting local charities and service initiatives.',
 'hello@unityserve.org',
 'unityserve-logo.png');

 SELECT * FROM organization;

SELECT organization_id, name
FROM organization;

CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organization(organization_id),
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL
);

INSERT INTO project
    (organization_id, title, description, location, date)
VALUES

-- BrightFuture Builders (Organization 1)
(1, 'Community Library Renovation',
 'Renovate a local community library to create a safer and more welcoming space for children and families.',
 'Dar es Salaam',
 '2026-10-10'),

(1, 'School Classroom Improvement',
 'Help repair and improve classrooms in a local school through painting, repairs, and basic construction work.',
 'Kinondoni, Dar es Salaam',
 '2026-10-17'),

(1, 'Community Garden Construction',
 'Build garden spaces that residents can use to grow vegetables and improve access to fresh food.',
 'Temeke, Dar es Salaam',
 '2026-10-24'),

(1, 'Safe Water Station Project',
 'Assist with the construction and improvement of a community water access station.',
 'Ubungo, Dar es Salaam',
 '2026-11-07'),

(1, 'Neighborhood Clean-Up and Repair',
 'Clean public areas and complete small repairs to improve the appearance and safety of the neighborhood.',
 'Ilala, Dar es Salaam',
 '2026-11-14'),


-- GreenHarvest Growers (Organization 2)
(2, 'Urban Vegetable Garden',
 'Create a community vegetable garden where residents can learn sustainable farming methods.',
 'Mikocheni, Dar es Salaam',
 '2026-10-11'),

(2, 'School Farming Workshop',
 'Teach students basic gardening, composting, and sustainable food production skills.',
 'Kigamboni, Dar es Salaam',
 '2026-10-18'),

(2, 'Community Composting Project',
 'Help residents create a simple composting system to reduce waste and support local gardens.',
 'Sinza, Dar es Salaam',
 '2026-10-25'),

(2, 'Tree Planting Day',
 'Plant trees around community spaces and teach volunteers about environmental conservation.',
 'Masaki, Dar es Salaam',
 '2026-11-08'),

(2, 'Urban Farming Training',
 'Provide practical training on growing vegetables in small urban spaces.',
 'Manzese, Dar es Salaam',
 '2026-11-15'),


-- UnityServe Volunteers (Organization 3)
(3, 'Food Donation Drive',
 'Collect and distribute food donations to families and community members who need support.',
 'Kinondoni, Dar es Salaam',
 '2026-10-12'),

(3, 'Elderly Community Visit',
 'Spend time with elderly community members and assist with basic activities and companionship.',
 'Ilala, Dar es Salaam',
 '2026-10-19'),

(3, 'Children''s Learning Support',
 'Volunteer with children by helping them with reading, homework, and educational activities.',
 'Temeke, Dar es Salaam',
 '2026-10-26'),

(3, 'Charity Donation Sorting',
 'Sort donated clothing, household items, and other supplies before they are distributed to local charities.',
 'Ubungo, Dar es Salaam',
 '2026-11-09'),

(3, 'Community Service Day',
 'Bring volunteers together to support several local service activities and community improvement efforts.',
 'Kigamboni, Dar es Salaam',
 '2026-11-16');

 SELECT * FROM project;

 CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE project_category (
    project_id INTEGER NOT NULL REFERENCES project(project_id),
    category_id INTEGER NOT NULL REFERENCES category(category_id),
    PRIMARY KEY (project_id, category_id)
);

INSERT INTO category (name)
VALUES
('Environmental'),
('Education'),
('Community Development');

SELECT * FROM category;

INSERT INTO project_category (project_id, category_id)
VALUES
-- BrightFuture Builders
(1, 3), -- Community Library Renovation → Community Development
(2, 3), -- School Classroom Improvement → Community Development
(3, 3), -- Community Garden Construction → Community Development
(4, 3), -- Safe Water Station Project → Community Development
(5, 3), -- Neighborhood Clean-Up and Repair → Community Development

-- GreenHarvest Growers
(6, 1), -- Urban Vegetable Garden → Environmental
(7, 2), -- School Farming Workshop → Education
(8, 1), -- Community Composting Project → Environmental
(9, 1), -- Tree Planting Day → Environmental
(10, 2), -- Urban Farming Training → Education

-- UnityServe Volunteers
(11, 3), -- Food Donation Drive → Community Development
(12, 3), -- Elderly Community Visit → Community Development
(13, 2), -- Children's Learning Support → Education
(14, 3), -- Charity Donation Sorting → Community Development
(15, 3); -- Community Service Day → Community Development

SELECT *
FROM project_category
ORDER BY project_id;
