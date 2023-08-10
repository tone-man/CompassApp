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
 * @returns id of the entry
 */
function createBehaviorLog(user_id, behavior_id, date_of_event) {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO student_behavior_log (user_id, behavior_id, date_of_event) VALUES (?, ?, ?)";
    db.run(query, [user_id, behavior_id, date_of_event], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ entryId: this.lastID });
      }
    });
  });
}

/**
 * Create a skill to be tracked
 * @param {*} skillName
 * @returns id of skill
 */
function createMasterySkill(skillName) {
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
function createSkillMasteryLog(
  user_id,
  skill_id,
  mastery_status,
  date_of_event
) {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO skill_mastery_log (user_id, skill_id, mastery_status, date_of_event) VALUES (?, ?, ?, ?)";
    db.run(
      query,
      [user_id, skill_id, mastery_status, date_of_event],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ entryId: this.lastID });
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
function createStudyLog(
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
          resolve({ entryId: this.lastID });
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
      else reject();
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
 * Gets all behaviors by user_id
 * @param {*} user_id
 * @returns
 */
function getBehaviorLogByStudent(user_id) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM student_behavior_log WHERE user_id = ? ORDER BY date_of_event",
      userId,
      (err, rows) => {
        if (err) reject(err);
        else if (rows.length > 0) resolve(rows);
        else reject();
      }
    );
  });
}

/**
 * Get Skill by id
 * @param {*} skillId
 * @returns skill name
 */
function getMasterySkillById(skillId) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM skills WHERE skill_id = ?";
    db.get(query, [skillId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

/**
 * Get All Skills
 * @returns all skills
 */
function getAllMasterySkills() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM skills", (err, rows) => {
      if (err) {
        reject(statusError("Internal server error.", 500));
      } else if (rows.length > 0) {
        resolve(rows);
      } else {
        reject(statusError("Skill categories not found.", 404));
      }
    });
  });
}

/**
 * Get Mastery Entries for a student
 * @param {*} userId
 * @returns list of entries in json
 */
function getSkillMasteryByStudent(userId) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM skill_mastery_log WHERE user_id = ? ORDER BY skill_id, date_of_event",
      userId,
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
}

/**
 * Get Student info based off user id
 * @param {*} user_id
 * @returns data from student
 */
function getStudentById(user_id) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM students WHERE user_id = ?";
    db.get(query, [user_id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

/**
 * Get study hour entries for a student
 * @param {*} userId
 * @returns entries for the student
 */
function getStudentStudyHours(userId) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM student_study_log WHERE user_id = ? ORDER BY datetime_of_sign_in",
      userId,
      (err, rows) => {
        if (err) reject(statusError(Responses[500], 500));
        else if (rows.length > 0) resolve(rows);
        else reject(statusError(Responses[404], 404));
      }
    );
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
 * Updates Behavior log entry
 * @param {*} entry_id
 * @param {*} user_id
 * @param {*} behavior_id
 * @param {*} date_of_event
 * @returns none
 */
function updateBehaviorLog(entry_id, user_id, behavior_id, date_of_event) {
  return new Promise((resolve, reject) => {
    const query =
      "UPDATE student_behavior_log SET user_id = ?, behavior_id = ?, date_of_event = ? WHERE entry_id = ?";
    db.run(
      query,
      [user_id, behavior_id, date_of_event, entry_id],
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
 * Update skill name
 * @param {*} skillId
 * @param {*} newSkillName
 * @returns
 */
function updateMasterySkill(skillId, newSkillName) {
  return new Promise((resolve, reject) => {
    const query = "UPDATE skills SET skill_name = ? WHERE skill_id = ?";
    db.run(query, [newSkillName, skillId], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Update a mastery entry by id
 * @param {*} entry_id
 * @param {*} mastery_status
 * @returns none
 */
function updateSkillMasteryLog(entry_id, mastery_status) {
  return new Promise((resolve, reject) => {
    const query =
      "UPDATE skill_mastery_log SET mastery_status = ? WHERE entry_id = ?";
    db.run(query, [mastery_status, entry_id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Updates data for a specific student
 * @param {*} user_id
 * @param {*} study_time_completed
 * @param {*} study_time_required
 * @param {*} base_time_required
 * @returns
 */
function updateStudent(
  user_id,
  study_time_completed,
  study_time_required,
  base_time_required
) {
  return new Promise((resolve, reject) => {
    const query =
      "UPDATE students SET study_time_completed = ?, study_time_required = ?, base_time_required = ? WHERE user_id = ?";
    db.run(
      query,
      [study_time_completed, study_time_required, base_time_required, user_id],
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
 * Update entry of study hours
 * @param {*} entryId
 * @param {*} datetime_of_sign_in
 * @param {*} datetime_of_sign_out
 * @param {*} duration_of_study
 * @returns
 */
function updateStudyLog(
  entryId,
  datetime_of_sign_in,
  datetime_of_sign_out,
  duration_of_study
) {
  return new Promise((resolve, reject) => {
    const query =
      "UPDATE student_study_log SET datetime_of_sign_in = ?, datetime_of_sign_out = ?, duration_of_study = ? WHERE entry_id = ?";
    db.run(
      query,
      [datetime_of_sign_in, datetime_of_sign_out, duration_of_study, entryId],
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

/**
 * Deletes a entry frow the behavior log
 * @param {*} entry_id
 * @returns none
 */
function deleteBehaviorLog(entry_id) {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM student_behavior_log WHERE entry_id = ?";
    db.run(query, [entry_id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Delete a skill
 * @param {*} skillId
 * @returns
 */
function deleteMasterySkill(skillId) {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM skills WHERE skill_id = ?";
    db.run(query, [skillId], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Delete a mastery entry
 * @param {*} entry_id
 * @returns none
 */
function deleteSkillMasteryLog(entry_id) {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM skill_mastery_log WHERE entry_id = ?";
    db.run(query, [entry_id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Delete Student Information for a Usor
 * @param {*} user_id
 * @returns
 */
function deleteStudent(user_id) {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM students WHERE user_id = ?";
    db.run(query, [user_id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Delete a study hour entry
 * @param {*} entryId
 * @returns none
 */
function deleteStudyLog(entryId) {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM student_study_log WHERE entry_id = ?";
    db.run(query, [entryId], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

modules.exports = {
  createUser,
  createUserRole,
  createBehaviorConsequence,
  createBehaviorLog,
  createMasterySkill,
  createSkillMasteryLog,
  createStudent,
  createStudentBehavior,
  createStudyLog,
  getAllMasterySkills,
  getAllStudentBehaviors,
  getBehaviorById,
  getBehaviorConsequence,
  getBehaviorLogByStudent,
  getMasterySkillById,
  getSkillMasteryByStudent,
  getStudentById,
  getStudentStudyHours,
  getUserById,
  getUserRoleMapping,
  updateBehavior,
  updateBehaviorConsequence,
  updateBehaviorLog,
  updateMasterySkill,
  updateStudent,
  updateStudyLog,
  updateUser,
  updateUserRole,
  deleteBehavior,
  deleteBehaviorConsequence,
  deleteBehaviorLog,
  deleteMasterySkill,
  deleteSkillMasteryLog,
  deleteStudent,
  deleteStudyLog,
  deleteUser,
  deleteUserRoleMapping,
};
