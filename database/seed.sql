-- Insert skills
INSERT INTO skills (name, category, description) VALUES
('Python', 'Programming Language', 'General-purpose programming language'),
('SQL', 'Database', 'Structured Query Language for databases'),
('JavaScript', 'Programming Language', 'Web programming language'),
('React', 'Frontend Framework', 'JavaScript library for UI'),
('Node.js', 'Backend Runtime', 'JavaScript runtime for servers'),
('Docker', 'DevOps', 'Container platform'),
('Kubernetes', 'DevOps', 'Container orchestration'),
('AWS', 'Cloud', 'Amazon Web Services'),
('Machine Learning', 'AI/ML', 'Building predictive models'),
('Deep Learning', 'AI/ML', 'Neural networks and deep learning'),
('Statistics', 'Data Science', 'Statistical analysis'),
('Pandas', 'Data Science', 'Data manipulation library'),
('NumPy', 'Data Science', 'Numerical computing library'),
('Scikit-learn', 'AI/ML', 'Machine learning library'),
('TensorFlow', 'AI/ML', 'Deep learning framework'),
('Power BI', 'Visualization', 'Business intelligence tool'),
('Tableau', 'Visualization', 'Data visualization tool'),
('Excel', 'Office', 'Spreadsheet application'),
('Git', 'Developer Tools', 'Version control'),
('Linux', 'OS', 'Linux operating system');

-- Insert career roles
INSERT INTO career_roles (name, description, average_readiness_threshold) VALUES
('Data Scientist', 'Analyze complex datasets and build predictive models using ML', 75),
('Data Analyst', 'Analyze business data and create insights for decision making', 65),
('Machine Learning Engineer', 'Build and deploy machine learning models at scale', 80),
('AI Engineer', 'Develop advanced AI systems and solutions', 85),
('Full Stack Developer', 'Build complete web applications frontend and backend', 70),
('Frontend Developer', 'Build user interfaces for web applications', 65),
('Backend Developer', 'Build server-side applications and APIs', 70),
('Software Engineer', 'Design and build software systems', 70),
('Cloud Engineer', 'Design and manage cloud infrastructure', 75),
('Cybersecurity Analyst', 'Protect systems from security threats', 75);

-- Data Scientist skills
INSERT INTO role_skills (role_id, skill_id, importance, required_level) 
SELECT cr.id, s.id, 5, 3 FROM career_roles cr, skills s 
WHERE cr.name = 'Data Scientist' AND s.name IN ('Python', 'SQL', 'Statistics', 'Machine Learning');

INSERT INTO role_skills (role_id, skill_id, importance, required_level) 
SELECT cr.id, s.id, 4, 3 FROM career_roles cr, skills s 
WHERE cr.name = 'Data Scientist' AND s.name IN ('Pandas', 'NumPy', 'Power BI', 'Git');

INSERT INTO role_skills (role_id, skill_id, importance, required_level) 
SELECT cr.id, s.id, 3, 2 FROM career_roles cr, skills s 
WHERE cr.name = 'Data Scientist' AND s.name IN ('Deep Learning', 'Scikit-learn');

-- Machine Learning Engineer skills
INSERT INTO role_skills (role_id, skill_id, importance, required_level) 
SELECT cr.id, s.id, 5, 4 FROM career_roles cr, skills s 
WHERE cr.name = 'Machine Learning Engineer' AND s.name IN ('Python', 'Machine Learning', 'Deep Learning');

INSERT INTO role_skills (role_id, skill_id, importance, required_level) 
SELECT cr.id, s.id, 4, 3 FROM career_roles cr, skills s 
WHERE cr.name = 'Machine Learning Engineer' AND s.name IN ('TensorFlow', 'SQL', 'Git', 'Docker');

-- Full Stack Developer skills
INSERT INTO role_skills (role_id, skill_id, importance, required_level) 
SELECT cr.id, s.id, 5, 3 FROM career_roles cr, skills s 
WHERE cr.name = 'Full Stack Developer' AND s.name IN ('JavaScript', 'React', 'Node.js', 'SQL');

INSERT INTO role_skills (role_id, skill_id, importance, required_level) 
SELECT cr.id, s.id, 4, 2 FROM career_roles cr, skills s 
WHERE cr.name = 'Full Stack Developer' AND s.name IN ('Git', 'Docker');

-- Frontend Developer skills
INSERT INTO role_skills (role_id, skill_id, importance, required_level) 
SELECT cr.id, s.id, 5, 4 FROM career_roles cr, skills s 
WHERE cr.name = 'Frontend Developer' AND s.name IN ('JavaScript', 'React');

INSERT INTO role_skills (role_id, skill_id, importance, required_level) 
SELECT cr.id, s.id, 4, 3 FROM career_roles cr, skills s 
WHERE cr.name = 'Frontend Developer' AND s.name IN ('Git', 'CSS/HTML');

-- Backend Developer skills
INSERT INTO role_skills (role_id, skill_id, importance, required_level) 
SELECT cr.id, s.id, 5, 3 FROM career_roles cr, skills s 
WHERE cr.name = 'Backend Developer' AND s.name IN ('Python', 'Node.js', 'SQL');

INSERT INTO role_skills (role_id, skill_id, importance, required_level) 
SELECT cr.id, s.id, 4, 2 FROM career_roles cr, skills s 
WHERE cr.name = 'Backend Developer' AND s.name IN ('Docker', 'Git');

-- Cloud Engineer skills
INSERT INTO role_skills (role_id, skill_id, importance, required_level) 
SELECT cr.id, s.id, 5, 3 FROM career_roles cr, skills s 
WHERE cr.name = 'Cloud Engineer' AND s.name IN ('AWS', 'Docker', 'Linux');

INSERT INTO role_skills (role_id, skill_id, importance, required_level) 
SELECT cr.id, s.id, 4, 2 FROM career_roles cr, skills s 
WHERE cr.name = 'Cloud Engineer' AND s.name IN ('Kubernetes', 'Python');

-- Cybersecurity Analyst skills
INSERT INTO role_skills (role_id, skill_id, importance, required_level) 
SELECT cr.id, s.id, 5, 3 FROM career_roles cr, skills s 
WHERE cr.name = 'Cybersecurity Analyst' AND s.name IN ('Linux', 'Git', 'Python');

INSERT INTO role_skills (role_id, skill_id, importance, required_level) 
SELECT cr.id, s.id, 4, 2 FROM career_roles cr, skills s 
WHERE cr.name = 'Cybersecurity Analyst' AND s.name IN ('Docker', 'AWS');
