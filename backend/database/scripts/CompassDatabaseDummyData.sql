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

INSERT INTO student_behavior_consequences (behavior_id, additional_study_minutes) VALUES
  (1, 120),
  (2, 90),
  (3, 60);

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

INSERT INTO skill_mastery_log (user_id, skill_id, mastery_status, date_of_event)
VALUES
  (1, 1, 1.5, date('now')),
  (1, 1, 2.5, date('now', '-7 day')),
  (1, 1, 2, date('now', '-14 days')),
  (1, 1, 2.4, date('now', '-21 days')),
  (1, 1, 4, date('now', '-28 days')),

  (1, 2, 1.5, date('now')),
  (1, 2, 2.5, date('now', '-7 day')),
  (1, 2, 2, date('now', '-14 days')),
  (1, 2, 2.4, date('now', '-21 days')),
  (1, 2, 4, date('now', '-28 days')),

  (1, 3, 1.5, date('now')),
  (1, 3, 2.5, date('now', '-7 day')),

  (1, 4, 0, date('now', '-28 days')),

  (1, 5, 1.5, date('now')),
  (1, 5, 2.5, date('now', '-7 day')),
  (1, 5, 2, date('now', '-14 days')),
  (1, 5, 2.4, date('now', '-21 days')),
  (1, 5, 4, date('now', '-28 days'));

INSERT INTO students (user_id, study_time_completed, study_time_required, base_time_required)
VALUES
  (1, 780, 1200, 1200);

INSERT INTO student_study_log (user_id, datetime_of_sign_in, datetime_of_sign_out , duration_of_study)
VALUES
  (1, datetime('now'), datetime('now', '+3 hours'), 180),
  (1, datetime('now', '-1 day'), datetime('now','-1 day', '+4 hours'), 240),
  (1, datetime('now', '-2 days'), datetime('now','-1 day', '+2 hours'),  120),
  (1, datetime('now', '-3 days'), datetime('now','-1 day', '+2 hours'), 120),
  (1, datetime('now', '-4 days'), datetime('now','-1 day', '+2 hours'), 120);





