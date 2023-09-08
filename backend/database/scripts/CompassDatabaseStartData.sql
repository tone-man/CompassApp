INSERT INTO users (name, email) VALUES
  ('Compass Admin', 'compasslearningapplication@gmail.com'),
  ('Michael Mascolo', 'mascolom@merrimack.edu'),
  ('Diana Marginean', 'margineand@merrimack.edu'),
  ('Kristina Micalizzi', 'micalizzik@merrimack.edu'),
  ('Brian Zager', 'zagerb@merrimack.edu'),
  ('Lizzie Linn', 'linnl@merrimack.edu'),
  ('Kelley Bateman', 'batemank@merrimack.edu');

INSERT INTO user_roles (role_name) VALUES
  ('Student'),
  ('Teacher'),
  ('Admin');

INSERT INTO user_roles_mapping (user_id, role_id) VALUES
  (1, 3),
  (2, 3),
  (3, 2),
  (4, 2),
  (5, 2),
  (6, 2),
  (7, 2);

INSERT INTO student_behaviors (behavior_name) VALUES
  ('Missed Class'),
  ('Missed Coaching Meeting'),
  ('Missing Assignment'),
  ('Assignment Completed Late');

INSERT INTO student_behavior_consequences (behavior_id, additional_study_minutes) VALUES
  (1, 130),
  (2, 130),
  (3, 130),
  (4, 0);

INSERT INTO skills (skill_name) VALUES
  ('Homework'),
  ('Reading'),
  ('Writing'),
  ('Notetaking'),
  ('Growth Mindset');
  