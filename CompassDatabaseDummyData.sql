--Fills the tables with dummy data

INSERT INTO users (name, email) VALUES
  ('John Doe', 'john.doe@example.com'),
  ('Jane Smith', 'jane.smith@example.com'),
  ('Michael Johnson', 'michael.johnson@example.com'),
  ('Emily Brown', 'emily.brown@example.com'),
  ('David Wilson', 'david.wilson@example.com'),
  ('Olivia Davis', 'olivia.davis@example.com'),
  ('James Anderson', 'james.anderson@example.com'),
  ('Emma Taylor', 'emma.taylor@example.com'),
  ('William Clark', 'william.clark@example.com'),
  ('Sophia Lee', 'sophia.lee@example.com');

INSERT INTO user_roles (role_name) VALUES
  ('Student'),
  ('Teacher'),
  ('Admin');

INSERT INTO user_roles_mapping (user_id, role_id) VALUES
  (1, 1),
  (2, 2),
  (3, 3),
  (4, 1),
  (5, 1),
  (6, 1),
  (7, 1),
  (8, 1),
  (9, 1),
  (10, 1);

INSERT INTO student_behaviors (behavior_name) VALUES
  ('Late Submission'),
  ('Absenteeism'),
  ('Incomplete Assignments'),
  ('Disruptive Behavior'),
  ('Lack of Participation'),
  ('Poor Time Management'),
  ('Cheating'),
  ('Plagiarism'),
  ('Lack of Preparedness'),
  ('Poor Collaboration');

INSERT INTO student_behavior_consequences (behavior_id, additional_study_hours) VALUES
  (1, 2),
  (2, 3),
  (3, 1),
  (4, 2),
  (5, 1),
  (6, 3),
  (7, 2),
  (8, 1),
  (9, 2),
  (10, 1);

INSERT INTO student_behavior_log (user_id, behavior_id, date_of_event) VALUES
  (1, 1, '2023-05-01'),
  (2, 2, '2023-05-02'),
  (3, 3, '2023-05-03'),
  (4, 4, '2023-05-04'),
  (5, 5, '2023-05-05'),
  (6, 6, '2023-05-06'),
  (7, 7, '2023-05-07'),
  (8, 8, '2023-05-08'),
  (9, 9, '2023-05-09'),
  (10, 10, '2023-05-10');

INSERT INTO student_study_hours (user_id, study_hours_completed, hours_needed, base_study_hours) VALUES
  (1, 20, 30, 40),
  (2, 25, 35, 40),
  (3, 18, 28, 40),
  (4, 22, 32, 40),
  (5, 15, 25, 40),
  (6, 30, 40, 40),
  (7, 28, 38, 40),
  (8, 17, 27, 40),
  (9, 23, 33, 40),
  (10, 19, 29, 40);


INSERT INTO skill_types (skill_type) VALUES
  ('Homework'),
  ('Reading'),
  ('Writing'),
  ('Notetaking'),
  ('Growth Mindset');

INSERT INTO skills (skill_name, skill_type) VALUES
  ('Algebra', 1),
  ('Geometry', 1),
  ('Calculus', 1),
  ('Biology', 1),
  ('Chemistry', 1),
  ('Physics', 1),
  ('History', 2),
  ('Literature', 2),
  ('Poetry', 2),
  ('Essay Writing', 3),
  ('Grammar', 3),
  ('Spelling', 3),
  ('Note Taking', 4),
  ('Organization', 4),
  ('Critical Thinking', 4),
  ('Growth Mindset', 5),
  ('Problem Solving', 5),
  ('Creativity', 5),
  ('Statistics', 1),
  ('Anatomy', 1),
  ('World Geography', 2),
  ('Shakespeare', 2),
  ('Fiction Writing', 3),
  ('Research Skills', 3),
  ('Study Skills', 4),
  ('Time Management', 4),
  ('Communication Skills', 5),
  ('Public Speaking', 5),
  ('Foreign Language', 2),
  ('Computer Programming', 1);

-- Generate skill log for each student
INSERT INTO skill_mastery_log (user_id, skill_id, mastery_status, date_of_event)
SELECT
  users.user_id,
  skills.skill_id,
  ROUND(ABS(RANDOM() % 2)) AS mastery_status,
  date('now', '-' || (ABS(RANDOM()) % 90) || ' day') AS date_of_event
FROM
  users, skills
ORDER BY
  users.user_id, skills.skill_id;




