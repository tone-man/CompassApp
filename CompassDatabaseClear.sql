PRAGMA foreign_keys = OFF; -- Disable foreign key checks temporarily

-- Drop tables in the reverse order of their creation (foreign key dependencies should be considered)
DROP TABLE IF EXISTS student_study_hours;
DROP TABLE IF EXISTS skill_mastery_log;
DROP TABLE IF EXISTS student_behaviors;
DROP TABLE IF EXISTS student_behavior_log;
DROP TABLE IF EXISTS student_behavior_consequences;
DROP TABLE IF EXISTS skill;
DROP TABLE IF EXISTS skill_types;
DROP TABLE IF EXISTS user_roles_mapping;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS users;

PRAGMA foreign_keys = ON; -- Enable foreign key checks
