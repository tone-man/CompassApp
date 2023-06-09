--Fills the tables with dummy data

INSERT INTO users (name, email) VALUES
  ('John Doe', 'john.doe@example.com'),
  ('Jane Smith', 'jane.smith@example.com'),
  ('Michael Johnson', 'michael.johnson@example.com');


INSERT INTO user_roles (role_name) VALUES
  ('Student'),
  ('Teacher'),
  ('Admin');

INSERT INTO user_roles_mapping (user_id, role_id) VALUES
  (1, 1),
  (2, 2),
  (3, 3);

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

INSERT INTO students (user_id, study_hours_completed, study_hours_required, base_study_hours)
VALUES
  (1, 13, 20, 20);

INSERT INTO student_study_log (user_id, date_of_event, log_in_time, log_out_time, study_duration)
VALUES
  (1, date('now'), 9, 12, 180),
  (1, date('now', '-1 day'), 14, 18, 240),
  (1, date('now', '-2 days'), 10, 12, 120),
  (1, date('now', '-3 days'), 15, 17, 120),
  (1, date('now', '-4 days'), 13, 15, 120);





