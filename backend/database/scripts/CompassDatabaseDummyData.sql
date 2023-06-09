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
  ('Missed Class'),
  ('Missed Coaching Meeting'),
  ('Incomplete Assignment');

INSERT INTO student_behavior_consequences (behavior_id, additional_study_hours) VALUES
  (1, 2),
  (2, 3),
  (3, 1);

INSERT INTO student_behavior_log (user_id, behavior_id, date_of_event) 
SELECT
  users.user_id,
  student_behaviors.behavior_id,
  date('now', '-' || (ABS(RANDOM()) % 90) || ' day') AS date_of_event
FROM
  users, student_behaviors
ORDER BY
  users.user_id, student_behaviors.behavior_id;

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


INSERT INTO skills (skill_name) VALUES
  ('Homework'),
  ('Reading'),
  ('Writing'),
  ('Notetaking'),
  ('Growth Mindset');

  

-- Generate skill log for each student
INSERT INTO skill_mastery_log (user_id, skill_id, mastery_status, date_of_event)
SELECT
  users.user_id,
  skills.skill_id,
  ABS(RANDOM() % 5) AS mastery_status,
  date('now', '-' || (ABS(RANDOM()) % 90) || ' day') AS date_of_event
FROM
  users, skills
ORDER BY
  users.user_id, skills.skill_id;




