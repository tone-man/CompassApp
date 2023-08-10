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
 *
 * READ QUERIES
 *
 */

/**
 *
 * UPDATE QUERIES
 *
 */

/**
 *
 * DELETE QUERIES
 *
 */

modules.exports = { createUser, createUserRole };
