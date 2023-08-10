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
