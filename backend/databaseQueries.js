const sqlite3 = require("sqlite3").verbose();

/**
 *
 * CREATIONAL QUERIES
 *
 */

/**
 * Creates a user
 * @param {*} db
 * @param {*} name
 * @param {*} email
 * @returns id of user
 */
function createUser(db, name, email) {
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
 * @param {*} db
 * @param {*} userId
 * @param {*} userRole
 * @returns nothing
 */
function createUserRole(db, userId, userRole) {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO user_roles_mapping (user_id, role_id) VALUES (?, ?)";
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
 * @param {*} db
 * @param {*} behaviorName
 * @returns id of behaviour
 */
function createBehavior(db, behaviorName) {
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
 * @param {*} db
 * @param {*} behaviorId
 * @param {*} additionalStudyMinutes
 * @returns the id of the behavior mapped
 */
function createBehaviorConsequence(db, behaviorId, additionalStudyMinutes) {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO student_behavior_consequences (behavior_id, additional_study_minutes) VALUES (?, ?)";
    db.run(query, [behaviorId, additionalStudyMinutes], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({
          behaviorId: behaviorId,
          additionalStudyMinutes: additionalStudyMinutes,
        });
      }
    });
  });
}

/**
 * Create a behavior entry
 * @param {*} db
 * @param {*} userId
 * @param {*} behaviorId
 * @param {*} dateOfEvent
 * @returns id of the entry
 */
function createBehaviorLog(db, user_id, behavior_id, date_of_event) {
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
 * @param {*} db
 * @param {*} skillName
 * @returns id of skill
 */
function createMasterySkill(db, skillName) {
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
 * @param {*} db
 * @param {*} userId
 * @param {*} skillId
 * @param {*} masteryStatus
 * @param {*} dateOfEvent
 * @returns none
 */
function createSkillMasteryLog(
  db,
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
 * @param {*} db
 * @param {*} user_id
 * @param {*} study_time_completed
 * @param {*} study_time_required
 * @param {*} base_time_required
 * @returns id of user that student was created for
 */
function createStudent(
  db,
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
 * @param {*} db
 * @param {*} user_id
 * @param {*} datetime_of_sign_in
 * @param {*} datetime_of_sign_out
 * @param {*} duration_of_study
 * @returns userId of entry
 */
function createStudyLog(
  db,
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
function getUserById(db, id) {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT * FROM users u INNER JOIN user_roles_mapping urm ON u.user_id = urm.user_id WHERE u.user_id = ? ";
    db.get(query, [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function getUserByEmail(db, email) {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT * FROM users u INNER JOIN user_roles_mapping urm ON u.user_id = urm.user_id  WHERE email = ?";
    db.get(query, [email], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

/**
 * Gets All users
 * @param {*} db
 * @returns
 */
function getAllUsers(db) {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT * FROM users u INNER JOIN user_roles_mapping urm ON u.user_id = urm.user_id ";
    db.all(query, (err, row) => {
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
 * @param {*} db
 * @param {*} user_id
 * @returns user role
 */
function getUserRoleMapping(db, user_id) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM user_roles_mapping WHERE user_id = ?";
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
 * Get a behavior by id
 * @param {*} db
 * @param {*} behavior_id
 * @returns
 */
function getBehaviorById(db, behavior_id) {
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
 * @param {*} db
 * @returns json of all behaviors
 */
function getAllStudentBehaviors(db) {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM student_behaviors;", (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

/**
 * Get all behaviors with consequences
 * @param {*} db
 * @returns json of all behaviors with consequences
 */
function getAllStudentBehaviorsWithConsequences(db) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM student_behaviors INNER JOIN student_behavior_consequences 
      ON student_behaviors.behavior_id = student_behavior_consequences.behavior_id;`,
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}

/**
 * Gets the consequences of a behavior
 * @param {*} db
 * @param {*} behavior_id
 * @returns
 */
function getBehaviorConsequenceById(db, behavior_id) {
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
 * Gets all Behavior Consequences
 * @param {*} db
 * @returns
 */
function getAllBehaviorConsequences(db) {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM student_behavior_consequences;", (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

/**
 * Gets Behavior Log by Id
 * @param {*} db
 * @param {*} behavior_id
 * @returns
 */
function getBehaviorLogById(db, entry_id) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM student_behavior_log WHERE entry_id = ?";
    db.get(query, [entry_id], (err, row) => {
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
 * @param {*} db
 * @param {*} user_id
 * @returns
 */
function getBehaviorLogByStudent(db, user_id) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM student_behavior_log WHERE user_id = ? ORDER BY date_of_event",
      user_id,
      (err, rows) => {
        if (err) reject(err);
        else if (rows.length > 0) resolve(rows);
        else reject();
      }
    );
  });
}

/**
 * Gets the Sum of Additional Study Time For a Student
 * @param {*} db
 * @param {*} userId
 * @returns
 */
function getSumStudentRequiredStudyTime(db, userId) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT SUM(additional_study_minutes) 
    AS sumBehaviorMinutes
    FROM student_behavior_log
    JOIN student_behavior_consequences
    ON student_behavior_log.behavior_id=student_behavior_consequences.behavior_id
    WHERE user_id = ?;`,
      userId,
      (error, row) => {
        if (error) reject(error);
        else if (row) resolve(row.sumBehaviorMinutes);
        else reject();
      }
    );
  });
}

function getSumStudentCompletedStudyTime(db, userId) {
  return new Promise((resolve, reject) => {
    const query = `SELECT SUM(duration_of_study)
  AS sumStudentStudyTime
  FROM student_study_log
  WHERE user_id = ?;`;

    db.get(query, userId, (err, row) => {
      if (err) {
        console.log(err);
        reject(statusError("Database Rejected Query.", 500));
      } else if (row) {
        resolve(row.sumStudentStudyTime);
      } else {
        resolve(0);
      }
    });
  });
}
/**
 * Get Skill by id
 * @param {*} db
 * @param {*} skillId
 * @returns skill name
 */
function getMasterySkillById(db, skillId) {
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
 * @param {*} db
 * @returns all skills
 */
function getAllMasterySkills(db) {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM skills", (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

/**
 * Get Mastery Entries for a student
 * @param {*} db
 * @param {*} userId
 * @returns list of entries in json
 */
function getSkillMasteryByStudent(db, userId) {
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
 * @param {*} db
 * @param {*} user_id
 * @returns data from student
 */
function getStudentById(db, user_id) {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT * FROM users  INNER JOIN students ON students.user_id = users.user_id WHERE users.user_id= ?";
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
 * Get Student info based off user id
 * @param {*} db
 * @param {*} user_id
 * @returns data from student
 */
function getAllStudents(db) {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT * FROM users  INNER JOIN students ON students.user_id = users.user_id";
    db.all(query, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

/**
 * Get a Students Base Study Time
 * @param {*} db
 * @param {*} userId
 * @returns
 */
function getBaseStudyTime(db, user_id) {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT (base_time_required) FROM students WHERE user_id = ?;";
    db.get(query, [user_id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row.base_time_required);
      }
    });
  });
}

/**
 * Get study hour entries for a student
 * @param {*} db
 * @param {*} userId
 * @returns entries for the student
 */
function getStudyHoursByStudent(db, userId) {
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
 * @param {*} db
 * @param {*} id
 * @param {*} name
 * @param {*} email
 * @returns none
 */
function updateUser(db, id, name, email) {
  return new Promise((resolve, reject) => {
    const query = "UPDATE users SET name = ?, email = ? WHERE user_id = ?";
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
 * @param {*} db
 * @param {*} id
 * @param {*} name
 * @param {*} email
 * @returns none
 */
function updateUserRoleMapping(db, user_id, role_id) {
  return new Promise((resolve, reject) => {
    const query = "UPDATE user_roles_mapping SET role_id = ? WHERE user_id = ?";
    db.run(query, [role_id, user_id], function (err) {
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
 * @param {*} db
 * @param {*} behavior_id
 * @param {*} behavior_name
 * @returns none
 */
function updateBehavior(db, behavior_id, behavior_name) {
  return new Promise((resolve, reject) => {
    const query =
      "UPDATE student_behaviors SET behavior_name = ? WHERE behavior_id = ?";
    db.run(query, [behavior_name, behavior_id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ changes: this.changes });
      }
    });
  });
}

/**
 * Updates the consequences of a behavior
 * @param {*} db
 * @param {*} behavior_id
 * @param {*} additional_study_minutes
 * @returns none
 */
function updateBehaviorConsequence(db, behavior_id, additional_study_minutes) {
  return new Promise((resolve, reject) => {
    const query =
      "UPDATE student_behavior_consequences SET additional_study_minutes = ? WHERE behavior_id = ?";
    db.run(query, [additional_study_minutes, behavior_id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ changes: this.changes });
      }
    });
  });
}

/**
 * Updates Behavior log entry
 * @param {*} db
 * @param {*} entry_id
 * @param {*} user_id
 * @param {*} behavior_id
 * @param {*} date_of_event
 * @returns none
 */
function updateBehaviorLog(db, entry_id, user_id, behavior_id, date_of_event) {
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
 * @param {*} db
 * @param {*} skillId
 * @param {*} newSkillName
 * @returns
 */
function updateMasterySkill(db, skillId, newSkillName) {
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
 * @param {*} db
 * @param {*} entry_id
 * @param {*} mastery_status
 * @returns none
 */
function updateSkillMasteryLog(db, entry_id, mastery_status) {
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
 * @param {*} db
 * @param {*} user_id
 * @param {*} study_time_completed
 * @param {*} study_time_required
 * @param {*} base_time_required
 * @returns
 */
function updateStudent(
  db,
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
 * Updates Student Completed Study Time
 * @param {*} user_id
 * @param {*}  totalTimeCompleted
 * @returns
 */
function updateStudentCompletedStudyTime(db, user_id, totalTimeCompleted) {
  return new Promise((resolve, reject) => {
    const query = `UPDATE students
    SET study_time_completed = ?
    WHERE user_id = ?`;
    db.run(query, [totalTimeCompleted, user_id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Updates Student Required Study Time
 * @param {*} user_id
 * @param {*} totalTimeRemaining
 * @returns
 */
function updateStudentRequiredStudyTime(db, user_id, totalTimeRemaining) {
  return new Promise((resolve, reject) => {
    const query = `UPDATE students
    SET study_time_required = ?
    WHERE user_id = ?`;
    db.run(query, [totalTimeRemaining, user_id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Update entry of study hours
 * @param {*} db
 * @param {*} entryId
 * @param {*} datetime_of_sign_in
 * @param {*} datetime_of_sign_out
 * @param {*} duration_of_study
 * @returns
 */
function updateStudyLog(
  db,
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
 * @param {*} db
 * @param {*} id
 * @returns none
 */
function deleteUser(db, id) {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM users WHERE user_id = ?";
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
 * @param {*} db
 * @param {*} user_id
 * @param {*} role_id
 * @returns none
 */
function deleteUserRoleMapping(db, user_id) {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM user_roles_mapping WHERE user_id = ?";
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
 * Deletes behavior of a given id
 * @param {*} db
 * @param {*} behavior_id
 * @returns none
 */
function deleteBehavior(db, behavior_id) {
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
 * @param {*} db
 * @param {*} behavior_id
 * @returns none
 */
function deleteBehaviorConsequence(db, behavior_id) {
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
 * @param {*} db
 * @param {*} entry_id
 * @returns none
 */
function deleteBehaviorLog(db, entry_id) {
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
 * @param {*} db
 * @param {*} skillId
 * @returns
 */
function deleteMasterySkill(db, skillId) {
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
 * @param {*} db
 * @param {*} entry_id
 * @returns none
 */
function deleteSkillMasteryLog(db, entry_id) {
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
 * Delete Student Information for a User
 * @param {*} db
 * @param {*} user_id
 * @returns
 */
function deleteStudent(db, user_id) {
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
 * @param {*} db
 * @param {*} entryId
 * @returns none
 */
function deleteStudyLog(db, entryId) {
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

module.exports = {
  createUser,
  createUserRole,
  createBehavior,
  createBehaviorConsequence,
  createBehaviorLog,
  createMasterySkill,
  createSkillMasteryLog,
  createStudent,
  createStudyLog,
  getAllUsers,
  getAllMasterySkills,
  getAllStudentBehaviors,
  getBehaviorById,
  getBehaviorConsequenceById,
  getAllBehaviorConsequences,
  getAllStudentBehaviorsWithConsequences,
  getBehaviorLogById,
  getBehaviorLogByStudent,
  getMasterySkillById,
  getSkillMasteryByStudent,
  getAllStudents,
  getStudentById,
  getUserByEmail,
  getStudyHoursByStudent,
  getUserById,
  getUserRoleMapping,
  getBaseStudyTime,
  getSumStudentRequiredStudyTime,
  getSumStudentCompletedStudyTime,
  updateBehavior,
  updateBehaviorConsequence,
  updateBehaviorLog,
  updateMasterySkill,
  updateStudent,
  updateStudyLog,
  updateUser,
  updateUserRoleMapping,
  updateSkillMasteryLog,
  updateStudentRequiredStudyTime,
  updateStudentCompletedStudyTime,
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
