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
