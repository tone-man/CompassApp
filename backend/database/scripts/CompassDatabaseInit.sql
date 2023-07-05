-- Initializes the DatabaseSchema in case we lose the database
CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_roles (
  role_id INTEGER PRIMARY KEY AUTOINCREMENT,
  role_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_roles_mapping (
  user_id INTEGER,
  role_id INTEGER,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (role_id) REFERENCES user_roles(role_id)
);

CREATE TABLE IF NOT EXISTS student_behaviors (
  behavior_id INTEGER PRIMARY KEY AUTOINCREMENT,
  behavior_name TEXT NOT NULL
);

CREATE TABLE  IF NOT EXISTS student_behavior_consequences (
  behavior_id INTEGER PRIMARY KEY,
  additional_study_minutes INTEGER NOT NULL,
  FOREIGN KEY (behavior_id) REFERENCES student_behaviors(behavior_id)
);

CREATE TABLE  IF NOT EXISTS student_behavior_log (
  user_id INTEGER,
  behavior_id INTEGER,
  date_of_event DATE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (behavior_id) REFERENCES student_behaviors(behavior_id)
);

CREATE TABLE  IF NOT EXISTS skills (
  skill_id INTEGER PRIMARY KEY AUTOINCREMENT,
  skill_name TEXT UNIQUE NOT NULL
);

CREATE TABLE  IF NOT EXISTS skill_mastery_log (
  user_id INTEGER,
  skill_id INTEGER,
  mastery_status DOUBLE(5, 4) NOT NULL,
  date_of_event DATE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (skill_id) REFERENCES skills(skill_id)
);

CREATE TABLE  IF NOT EXISTS students (
  user_id INTEGER PRIMARY KEY,
  study_time_completed INTEGER NOT NULL,
  study_time_required INTEGER NOT NULL,
  base_time_required INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE  IF NOT EXISTS student_study_log (
  user_id INTEGER,
  datetime_of_sign_in TEXT NOT NULL,
  datetime_of_sign_out TEXT NOT NULL,
  duration_of_study INTEGER NOT NULL
);


