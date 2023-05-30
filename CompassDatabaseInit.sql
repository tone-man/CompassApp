-- Initializes the DatabaseSchema in case we lose the database
CREATE TABLE users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL
);

CREATE TABLE user_roles (
  role_id INTEGER PRIMARY KEY AUTOINCREMENT,
  role_name TEXT NOT NULL
);

CREATE TABLE user_roles_mapping (
  user_id INTEGER,
  role_id INTEGER,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (role_id) REFERENCES user_roles(role_id)
);

CREATE TABLE student_behaviors (
  behavior_id INTEGER PRIMARY KEY AUTOINCREMENT,
  behavior_name TEXT NOT NULL
);

CREATE TABLE student_behavior_consequences (
  behavior_id INTEGER PRIMARY KEY,
  additional_study_hours INTEGER NOT NULL,
  FOREIGN KEY (behavior_id) REFERENCES student_behaviors(behavior_id)
);

CREATE TABLE student_behavior_log (
  user_id INTEGER,
  behavior_id INTEGER,
  date_of_event DATE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (behavior_id) REFERENCES student_behaviors(behavior_id)
);

CREATE TABLE skill_types (
  skill_type_id INTEGER PRIMARY KEY AUTOINCREMENT,
  skill_type TEXT UNIQUE NOT NULL
);

CREATE TABLE skills (
  skill_id INTEGER PRIMARY KEY AUTOINCREMENT,
  skill_name TEXT UNIQUE NOT NULL,
  skill_type INTEGER,
  FOREIGN KEY (skill_type) REFERENCES skill_types(skill_type_id)
);

CREATE TABLE skill_mastery_log (
  user_id INTEGER,
  skill_id INTEGER,
  mastery_status INTEGER NOT NULL,
  date_of_event DATE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (skill_id) REFERENCES skills(skill_id)
);

CREATE TABLE student_study_hours (
  user_id INTEGER PRIMARY KEY,
  study_hours_completed INTEGER NOT NULL,
  hours_needed INTEGER NOT NULL,
  base_study_hours INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
