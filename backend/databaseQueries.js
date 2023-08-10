const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database/CompassDatabase.db");

/**
 *
 * CREATIONAL QUERIES
 *
 */

/**
 * Creates a user
 * @param {*} name
 * @param {*} email
 * @returns id of user
 */
function createUser(name, email) {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO users (name, email) VALUES (?, ?)";
    db.run(query, [name, email], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID });
      }
    });
  });
}

/**
 * Creates a mapping between user amd a role
 * @param {*} userId
 * @param {*} userRole
 * @returns nothing
 */
function createUserRole(userId, userRole) {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO user_role_mapping (user_id, role_id) VALUES (?, ?)";
    db.run(query, [userId, userRole], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Creates a new behaviour
 * @param {*} behaviorName
 * @returns id of behaviour
 */
function createStudentBehavior(behaviorName) {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO student_behaviors (behavior_name) VALUES (?)";
    db.run(query, [behaviorName], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ behaviorId: this.lastID });
      }
    });
  });
}

/**
 * Create behaviour consequences
 * @param {*} behaviorId
 * @param {*} additionalStudyMinutes
 * @returns the id of the behavior mapped
 */
function createBehaviorConsequence(behaviorId, additionalStudyMinutes) {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO student_behavior_consequences (behavior_id, additional_study_minutes) VALUES (?, ?)";
    db.run(query, [behaviorId, additionalStudyMinutes], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ consequenceId: behaviorId });
      }
    });
  });
}

/**
 * Create a behavior entry
 * @param {*} userId
 * @param {*} behaviorId
 * @param {*} dateOfEvent
 * @returns none
 */
function createBehaviorLog(userId, behaviorId, dateOfEvent) {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO student_behavior_log (user_id, behavior_id, date_of_event) VALUES (?, ?, ?)";
    db.run(query, [userId, behaviorId, dateOfEvent], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Create a skill to be tracked
 * @param {*} skillName
 * @returns id of skill
 */
function createSkill(skillName) {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO skills (skill_name) VALUES (?)";
    db.run(query, [skillName], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ skillId: this.lastID });
      }
    });
  });
}

/**
 * Create a new skill mastery entry
 * @param {*} userId
 * @param {*} skillId
 * @param {*} masteryStatus
 * @param {*} dateOfEvent
 * @returns none
 */
function createSkillMasteryLog(userId, skillId, masteryStatus, dateOfEvent) {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO skill_mastery_log (user_id, skill_id, mastery_status, date_of_event) VALUES (?, ?, ?, ?)";
    db.run(
      query,
      [userId, skillId, masteryStatus, dateOfEvent],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

/**
 * Creates data required for a student
 * @param {*} user_id
 * @param {*} study_time_completed
 * @param {*} study_time_required
 * @param {*} base_time_required
 * @returns id of user that student was created for
 */
function createStudent(
  user_id,
  study_time_completed,
  study_time_required,
  base_time_required
) {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO students (user_id, study_time_completed, study_time_required, base_time_required) VALUES (?, ?, ?, ?)";
    db.run(
      query,
      [user_id, study_time_completed, study_time_required, base_time_required],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ studentId: user_id });
        }
      }
    );
  });
}

/**
 * Create a student study log entry
 * @param {*} user_id
 * @param {*} datetime_of_sign_in
 * @param {*} datetime_of_sign_out
 * @param {*} duration_of_study
 * @returns userId of entry
 */
function createStudentStudyLog(
  user_id,
  datetime_of_sign_in,
  datetime_of_sign_out,
  duration_of_study
) {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO student_study_log (user_id, datetime_of_sign_in, datetime_of_sign_out, duration_of_study) VALUES (?, ?, ?, ?)";
    db.run(
      query,
      [user_id, datetime_of_sign_in, datetime_of_sign_out, duration_of_study],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ studentId: user_id });
        }
      }
    );
  });
}

/**
 *
 * READ QUERIES
 *
 */

/**
 * Get a single user by Id
 * @param {*} id
 * @returns data of user as json
 */
function getUserById(id) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users WHERE id = ?";
    db.get(query, [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

/**
 * Get user role from user id
 * @param {*} user_id
 * @returns user role
 */
function getUserRoleMapping(user_id) {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT * FROM user_roles_mapping WHERE user_id = ? AND role_id = ?";
    db.get(query, [user_id, role_id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

/**
 * Get a behavior by id
 * @param {*} behavior_id
 * @returns
 */
function getBehaviorById(behavior_id) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM student_behaviors WHERE behavior_id = ?";
    db.get(query, [behavior_id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

/**
 * Get all behaviors
 * @returns json of all behaviors
 */
function getAllStudentBehaviors() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM student_behaviors;", (err, rows) => {
      if (err) reject(err);
      else if (rows.length > 0) resolve(rows);
      else reject(err);
    });
  });
}

/**
 * Gets the consequences of a behavior
 * @param {*} behavior_id
 * @returns
 */
function getBehaviorConsequence(behavior_id) {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT * FROM student_behavior_consequences WHERE behavior_id = ?";
    db.get(query, [behavior_id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

/**
 *
 * UPDATE QUERIES
 *
 */

/**
 * Update user info by id
 * @param {*} id
 * @param {*} name
 * @param {*} email
 * @returns none
 */
function updateUser(id, name, email) {
  return new Promise((resolve, reject) => {
    const query = "UPDATE users SET name = ?, email = ? WHERE id = ?";
    db.run(query, [name, email, id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Update user role by id
 * @param {*} id
 * @param {*} name
 * @param {*} email
 * @returns none
 */
function updateUserRole(user_id, role_id) {
  return new Promise((resolve, reject) => {
    const query = "UPDATE user_roles_mapping SET role_id = ? WHERE user_id = ?";
    db.run(query, [user_id, role_id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Update the name of a behavior
 * @param {*} behavior_id
 * @param {*} behavior_name
 * @returns none
 */
function updateBehavior(behavior_id, behavior_name) {
  return new Promise((resolve, reject) => {
    const query =
      "UPDATE student_behaviors SET behavior_name = ? WHERE behavior_id = ?";
    db.run(query, [behavior_name, behavior_id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Updates the consequences of a behavior
 * @param {*} behavior_id
 * @param {*} additional_study_minutes
 * @returns none
 */
function updateBehaviorConsequence(behavior_id, additional_study_minutes) {
  return new Promise((resolve, reject) => {
    const query =
      "UPDATE student_behavior_consequences SET additional_study_minutes = ? WHERE behavior_id = ?";
    db.run(query, [additional_study_minutes, behavior_id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 *
 * DELETE QUERIES
 *
 */

/**
 * Removes a user
 * @param {*} id
 * @returns none
 */
function deleteUser(id) {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM users WHERE id = ?";
    db.run(query, [id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Deletes a mapping between a user and role
 * @param {*} user_id
 * @param {*} role_id
 * @returns none
 */
function deleteUserRoleMapping(user_id, role_id) {
  return new Promise((resolve, reject) => {
    const query =
      "DELETE FROM user_roles_mapping WHERE user_id = ? AND role_id = ?";
    db.run(query, [user_id, role_id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Deletes behavior of a given id
 * @param {*} behavior_id
 * @returns none
 */
function deleteBehavior(behavior_id) {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM student_behaviors WHERE behavior_id = ?";
    db.run(query, [behavior_id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Deletes the behavior consequences
 * @param {*} behavior_id
 * @returns none
 */
function deleteBehaviorConsequence(behavior_id) {
  return new Promise((resolve, reject) => {
    const query =
      "DELETE FROM student_behavior_consequences WHERE behavior_id = ?";
    db.run(query, [behavior_id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

modules.exports = { createUser, createUserRole };
