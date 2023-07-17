const sqlite3 = require("sqlite3").verbose();
const express = require("express");
const app = express();

app.use(express.json()); //JSON to read headers

const port = 5000;

const Responses = require("./statusMessages");
const { statusError, formatResponse } = require("./utils");
const {
  validateUser,
  validateBehavior,
  validateSkill,
  validateMasteryStatus,
  validateDateOfEvent,
  validateDatetime,
  validateEmail,
} = require("./validation");

/* Opens Database Connection */
const db = new sqlite3.Database("database/CompassDatabase.db");

/* Get User Information */

function getUserInfo(email) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE email = ?", email, (err, row) => {
      if (err) reject(statusError("Internal server error.", 500));
      else if (row) resolve(row);
      else reject(statusError("User does not exist.", 404));
    });
  });
}

app.get("/api/users/:email", (req, res) => {
  const email = req.params.email;
  getUserInfo(email)
    .then((row) => {
      if (row) {
        res.json(row);
      }
    })
    .catch((error) => {
      console.error(error);
      res
        .status(error.statusCode)
        .json(formatResponse(error.statusCode, error.message));
    });
});

/* Get All Users Query */

function getAllUsers() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM users;`, (err, rows) => {
      if (err) reject(statusError("Internal server error.", 500));
      else if (rows.length > 0) resolve(rows);
      else reject(statusError("User does not exist.", 404));
    });
  });
}

app.get("/api/users", (req, res) => {
  getAllUsers()
    .then((rows) => {
      res.json(rows);
    })
    .catch((error) => {
      console.error(error);
      res
        .status(error.statusCode)
        .json(formatResponse(error.statusCode, error.message));
    });
});

/* Get User Role */
app.get("/api/user_roles/:user_id", (req, res) => {
  const userId = req.params.user_id;

  db.get(
    `SELECT * FROM user_roles_mapping INNER JOIN user_roles ON user_roles_mapping.role_id=user_roles.role_id WHERE user_id = ?;`,
    userId,
    (err, row) => {
      if (err) {
        console.error(err);
        res.status(500).send(Responses[500]);
      } else if (row) {
        res.json(row);
      } else {
        res.status(404).send(Responses[404]);
      }
    }
  );
});

const getUsersPostQuery = `SELECT * FROM users
INNER JOIN user_roles_mapping
ON users.user_id = user_roles_mapping.user_id
INNER JOIN user_roles
ON user_roles_mapping.role_id = user_roles.role_id
WHERE user_roles.role_name = $userRole
LIMIT $quantity;
`;

function getUsersPost(params) {
  let { $quantity, $userRole } = params;

  if (!$quantity) {
    throw statusError("Missing an entry limit.", 400);
  }

  if (!$userRole) {
    throw statusError("Missing a user role.", 400);
  }

  return new Promise((resolve, reject) => {
    db.all(getUsersPostQuery, params, (err, rows) => {
      if (err) {
        console.error(err);
        reject(statusError("Internal Server Error", 500));
      } else if (rows.length > 0) {
        resolve(rows);
      } else {
        reject(statusError($userRole + " does not exist.", 404));
      }
    });
  });
}

app.post("/api/users/", (req, res) => {
  let { userRole, quantity } = req.body;

  if (!quantity) {
    quantity = 1000;
  }

  const params = {
    $userRole: userRole,
    $quantity: quantity,
  };

  getUsersPost(params)
    .then((rows) => {
      res.json(rows);
    })
    .catch((error) => {
      console.error(error.message);
      res
        .status(error.statusCode)
        .json(formatResponse(error.statusCode, error.message));
    });
});

/* Get Skill Categories */
app.get("/api/skills/", (req, res) => {
  getSkillCategories()
    .then((rows) => {
      res.json(rows);
    })
    .catch((error) => {
      console.error(error);
      res
        .status(error.statusCode)
        .json(formatResponse(error.statusCode, error.message));
    });
});

function getSkillCategories() {
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

/* Get Student Skill Mastery Data */

function getSkillMasteryLog(userId) {
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

app.get("/api/skill_mastery/:user_id", (req, res) => {
  const userId = req.params.user_id;

  getSkillMasteryLog(userId)
    .then((rows) => {
      if (rows.length > 0) {
        res.json(rows);
      } else {
        res.status(404).send("Skill Mastery not found for the specified user");
      }
    })
    .catch((error) => {
      console.error(error);
      res
        .status(error.statusCode)
        .json(formatResponse(error.statusCode, error.message));
    });
});

/* Get Student Information */
function getStudentInfo(userId) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM students WHERE user_id = ?", userId, (err, row) => {
      if (err) reject(statusError(Responses[500], 500));
      else if (row) resolve(row);
      else reject(statusError(Responses[404], 404));
    });
  });
}

app.get("/api/students/:user_id", (req, res) => {
  const userId = req.params.user_id;

  getStudentInfo(userId)
    .then((row) => {
      res.json(row);
    })
    .catch((error) => {
      console.error(error);
      res
        .status(error.statusCode)
        .json(formatResponse(error.statusCode, error.message));
    });
});

/* Get Student Study Hours */
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

app.get("/api/study_hours/:user_id", (req, res) => {
  const userId = req.params.user_id;

  getStudentStudyHours(userId)
    .then((rows) => {
      res.json(rows);
    })
    .catch((error) => {
      console.error(error);
      res
        .status(error.statusCode)
        .json(formatResponse(error.statusCode, error.message));
    });
});

/* Get Student Bad Behaviors */
function getStudentBehaviorEvents(userId) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM student_behavior_log WHERE user_id = ? ORDER BY date_of_event",
      userId,
      (err, rows) => {
        if (err) reject(statusError(Responses[500], 500));
        else if (rows.length > 0) resolve(rows);
        else reject(statusError(Responses[404], 404));
      }
    );
  });
}

app.get("/api/behavior_events/:user_id", (req, res) => {
  const userId = req.params.user_id;

  getStudentBehaviorEvents(userId)
    .then((rows) => {
      res.json(rows);
    })
    .catch((error) => {
      console.error(error);
      res
        .status(error.statusCode)
        .json(formatResponse(error.statusCode, error.message));
    });
});

/* Get Behavior Categories */

function getStudentBehaviors() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM student_behaviors;", (err, rows) => {
      if (err) reject(statusError(Responses[500], 500));
      else if (rows.length > 0) resolve(rows);
      else reject(statusError(Responses[404], 404));
    });
  });
}

app.get("/api/behaviors", (req, res) => {
  getStudentBehaviors()
    .then((rows) => {
      res.json(rows);
    })
    .catch((error) => {
      console.error(error);
      res
        .status(error.statusCode)
        .json(formatResponse(error.statusCode, error.message));
    });
});

/* Get Behavior Consequences For Given Behavior */

function getStudentBehaviorConsequence(behaviorId) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM student_behavior_consequences WHERE behavior_id = ?;",
      behaviorId,
      (err, rows) => {
        if (err) reject(statusError(Responses[500], 500));
        else if (rows.length > 0) resolve(rows);
        else reject(statusError(Responses[404], 404));
      }
    );
  });
}
app.get("/api/behavior_consequences/:behavior_id", (req, res) => {
  const behaviorId = req.params.behavior_id;

  getStudentBehaviorConsequence(behaviorId)
    .then((rows) => {
      res.json(rows);
    })
    .catch((error) => {
      console.error(error);
      res
        .status(error.statusCode)
        .json(formatResponse(error.statusCode, error.message));
    });
});

const insertBehaviorQuery = `INSERT INTO student_behavior_log (user_id, behavior_id, date_of_event)
VALUES ($userId, $behaviorId, $dateOfEvent);`;

function insertBehavior(params) {
  return new Promise((resolve, reject) => {
    const { $userId, $behaviorId, $dateOfEvent } = params;

    if (!validateUser($userId))
      reject(statusError("userId must be an integer", 400));

    if (!validateBehavior($behaviorId))
      reject(statusError("behaviorId must be an integer", 400));

    if (!validateDateOfEvent($dateOfEvent))
      reject(statusError("dateofEvent must be in format 'YYYY-MM-DD'", 400));

    db.run(insertBehaviorQuery, params, (error) => {
      if (error) {
        reject(statusError("Database Rejected Query", 500));
      } else {
        console.log(
          `Behavior Event Logged As: {userId: ${$userId}, behaviorId: ${$behaviorId}, dateOfEvent: ${$dateOfEvent}}`
        );
        resolve();
      }
    });
  });
}

/* Add a Behavior to a Specific Student */
app.post("/api/behavior_events", (req, res) => {
  const { userId, behaviorId, dateOfEvent } = req.body;

  const params = {
    $userId: userId,
    $behaviorId: behaviorId,
    $dateOfEvent: dateOfEvent,
  };

  insertBehavior(params)
    .then(() => updateStudentStudyHoursRemaining(userId))
    .then(() => {
      res.status(200).send(formatResponse(200, Responses[200]));
    })
    .catch((error) => {
      rollbackUpdateToBehaviorLog(params);
      console.error(error);
      res
        .status(error.statusCode)
        .json(formatResponse(error.statusCode, error.message));
    })
    .catch((error) => {
      console.error(error);
      res
        .status(error.statusCode)
        .json(formatResponse(error.statusCode, error.message));
    });
});

const insertSkillMasteryQuery = `INSERT INTO skill_mastery_log (user_id, skill_id, mastery_status, date_of_event) 
VALUES ($userId, $skillId, $masteryStatus, $dateOfEvent)`;

function insertSkillMastery(params) {
  return new Promise((resolve, reject) => {
    const { $userId, $skillId, $masteryStatus, $dateOfEvent } = params;

    if (!validateUser($userId))
      reject(statusError("userId must be an integer", 400));

    if (!validateSkill($skillId))
      reject(statusError("skillId must be an integer", 400));

    if (!validateMasteryStatus($masteryStatus))
      reject(
        statusError("masteryStatus must be an number between 0 and 5", 400)
      );

    if (!validateDateOfEvent($dateOfEvent))
      reject(statusError("dateofEvent must be in format 'YYYY-MM-DD'", 400));

    db.run(insertSkillMasteryQuery, params, (error) => {
      if (error) {
        console.error(error);
        reject(statusError("Database Rejects Query", 500));
      } else {
        console.log(
          "Mastery Skill Logged As:" +
            `\n\t{user_id:${params.$userId}, skill_id:${params.$skillId}, mastery_status:${params.$masteryStatus}, date_of_event:${params.$dateOfEvent}}`
        );
        resolve();
      }
    });
  });
}

/* Add a Mastery Event to a Specific Student */
app.post("/api/skill_mastery", (req, res) => {
  const { userId, skillId, masteryStatus, dateOfEvent } = req.body;

  const params = {
    $userId: userId,
    $skillId: skillId,
    $masteryStatus: masteryStatus,
    $dateOfEvent: dateOfEvent,
  };

  insertSkillMastery(params)
    .then(() => {
      res.status(200).send(Responses[200]);
    })
    .catch((error) => {
      console.log(error);
      res
        .status(error.statusCode)
        .json(formatResponse(error.statusCode, error.message));
    });
});

const insertStudyHoursQuery = `INSERT INTO student_study_log (user_id, datetime_of_sign_in, datetime_of_sign_out, duration_of_study) 
VALUES ($userId, $datetimeOfLogIn, $datetimeOfLogOut, $durationOfStudy)`;

function insertStudyHours(params) {
  return new Promise((resolve, reject) => {
    const { $userId, $datetimeOfLogIn, $datetimeOfLogOut, $durationOfStudy } =
      params;

    if (!validateUser($userId)) {
      reject(statusError("userId must be an integer", 400));
    }

    if (!validateDatetime($datetimeOfLogIn)) {
      reject(
        statusError(
          "datetimeOfLogIn must be in format 'YYYY-MM-DD HH:MM:SS'.",
          400
        )
      );
    }

    if (!validateDatetime($datetimeOfLogOut)) {
      reject(
        statusError(
          "datetimeOfLogOut must be in format 'YYYY-MM-DD HH:MM:SS'.",
          400
        )
      );
    }

    db.run(insertStudyHoursQuery, params, (err) => {
      if (err) {
        console.error(err);
        reject(statusError("Database Rejected Query", 500));
      } else {
        console.log(
          `Study Hours Logged As:` +
            `\n\t{user_id: ${params.$userId}, datetime_of_sign_in: ${params.$datetimeOfLogIn}, datetime_of_sign_out: ${params.$datetimeOfLogOut}, duration_of_study: ${params.$durationOfStudy}}`
        );
        resolve();
      }
    });
  });
}

/* Add Study Hours for a Specific Student */
app.post("/api/study_hours", (req, res) => {
  const { userId, datetimeOfLogIn, datetimeOfLogOut, durationOfStudy } =
    req.body;

  const params = {
    $userId: userId,
    $datetimeOfLogIn: datetimeOfLogIn,
    $datetimeOfLogOut: datetimeOfLogOut,
    $durationOfStudy: durationOfStudy,
  };

  insertStudyHours(params)
    .then(updateStudentStudyHoursCompleted(userId))
    .then(() => {
      res.status(200).send(Responses[200]);
    })
    .catch((error) => {
      rollbackUpdateToStudentStudyLog(params);
      console.error(error);
      res
        .status(error.statusCode)
        .json(formatResponse(error.statusCode, error.message));
    })
    .catch((error) => {
      console.log(error);
      res
        .status(error.statusCode)
        .json(formatResponse(error.statusCode, error.message));
    });
});

const insertUserQuery = `INSERT INTO users (email, name)
VALUES ($email, $name)`;

function addUser(params) {
  return new Promise((resolve, reject) => {
    const { $name, $email } = params;

    if (!validateEmail($email)) {
      statusError("email must be in format 'user@example.com'.", 400);
    }

    db.run(insertUserQuery, params, (err) => {
      if (err) {
        console.log(err);
        reject(statusError(Responses[500], 500));
      } else {
        console.log(`User Created:` + `\n\t{name: ${$name}, email: ${$email}}`);
        resolve();
      }
    });
  });
}

const insertUserMappingQuery = `INSERT INTO user_mapping (email, name)
VALUES ($userId, $roleId)`;

function insertMappingQuery(params) {
  return new Promise((resolve, reject) => {
    const { $userId, $roleId } = params;

    db.run(insertUserQuery, params, (err) => {
      if (err) {
        console.log(err);
        reject(statusError(Responses[500], 500));
      } else {
        console.log(
          `User Mapping Created:` +
            `\n\t{user_id: ${$userId}, role_id: ${$roleId}}`
        );
        resolve();
      }
    });
  });
}

/* Sub Query For Updating Student Study Hours Completed*/

const sumStudentStudyTimeQuery = `SELECT SUM(duration_of_study)
  AS sumStudentStudyTime
  FROM student_study_log
  WHERE user_id = ?;`;

function sumStudentStudyTime(userId) {
  return new Promise((resolve, reject) => {
    if (!validateUser(userId)) {
      reject(statusError("userId must be an integer", 400));
    }

    db.get(sumStudentStudyTimeQuery, userId, (err, row) => {
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

const updateStudentMinutesCompletedQuery = `UPDATE students
  SET study_time_completed = $studyMinutesCompleted
  WHERE user_id = $userId;`;

function updateStudentStudyHoursCompleted(userId) {
  return new Promise((resolve, reject) => {
    if (!validateUser(userId)) {
      reject(statusError("userId must be an integer", 400));
    }

    sumStudentStudyTime(userId)
      .then((sumStudyMinutes) => {
        const params = {
          $userId: userId,
          $studyMinutesCompleted: sumStudyMinutes,
        };

        db.run(updateStudentMinutesCompletedQuery, params, (err) => {
          if (err) {
            console.log(err);
            reject(statusError("Database Rejected Query.", 500));
          } else {
            console.log(`Study hours updated successfully for user ${userId}`);
            resolve();
          }
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/* Sub Query For Updating Student Study Hours Required*/

const baseStudentStudyTimeQuery = `SELECT (base_time_required) 
  FROM students
  WHERE user_id = ?;`;

function baseStudyTime(userId) {
  return new Promise((resolve, reject) => {
    if (!validateUser(userId))
      reject(statusError("userId must be an integer", 400));

    db.get(baseStudentStudyTimeQuery, userId, (error, row) => {
      if (error) reject(statusError(Responses[500], 500));
      else if (row) resolve(row.base_time_required);
      else reject(statusError(Responses[400], 400));
    });
  });
}

const sumStudentRequiredStudyTimeQuery = `SELECT SUM(additional_study_minutes) 
  AS sumBehaviorMinutes
  FROM student_behavior_log
  JOIN student_behavior_consequences
  ON student_behavior_log.behavior_id=student_behavior_consequences.behavior_id
  WHERE user_id = ?;`;

function sumStudentRequiredStudyTime(userId) {
  return new Promise((resolve, reject) => {
    if (!validateUser(userId))
      reject(statusError("userId must be an integer", 400));

    db.get(sumStudentRequiredStudyTimeQuery, userId, (error, row) => {
      if (error) reject(statusError(Responses[500], 500));
      else if (row) resolve(row.sumBehaviorMinutes);
      else reject(statusError(Responses[400], 400));
    });
  });
}

const updateStudentMinutesRemainingQuery = `UPDATE students
  SET study_time_required = $totalTimeRemaining
  WHERE user_id = $userId`;

function updateStudentMinutesRemaining(params) {
  return new Promise((resolve, reject) => {
    const { $userId, $totalTimeRemaining } = params;

    if (!validateUser($userId))
      reject(statusError("userId must be an integer", 400));

    db.get(updateStudentMinutesRemainingQuery, params, (error, row) => {
      if (error) reject(statusError(Responses[500], 500));
      else resolve();
    });
  });
}

function updateStudentStudyHoursRemaining(userId) {
  return new Promise((resolve, reject) => {
    Promise.all([baseStudyTime(userId), sumStudentRequiredStudyTime(userId)])
      .then(([baseStudentMinutes, sumBehaviorMinutes]) => {
        const params = {
          $userId: userId,
          $totalTimeRemaining: baseStudentMinutes + sumBehaviorMinutes,
        };

        return updateStudentMinutesRemaining(params).then(() => {
          console.log(
            `Study hours remaining updated successfully for user ${userId}`
          );
          resolve();
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/* Rollback Functions for when one transaction passes but another fails. */

const rollbackUpdateToStudentStudyLogQuery = `UPDATE student_study_hours
  SET log_out_time = NULL AND study_duration = NULL,
  WHERE user_id = $userId AND log_in_time = $logInTime AND dateOfEvent = $dateOfEvent`;

function rollbackUpdateToStudentStudyLog(params) {
  const { $userId, $logInTime, $dateOfEvent } = params;

  if (!validateUser($userId))
    throw statusError("userId must be an integer", 400);

  if (!validateStudyLoggingTime($logInTime))
    throw statusError("logInTime must be an integer between 0 and 1440.", 400);

  if (!validateDateOfEvent($dateOfEvent))
    throw statusError("dateofEvent must be in format 'YYYY-MM-DD'", 400);

  db.run(rollbackUpdateToStudentStudyLogQuery, params, (err) => {
    if (err) {
      console.error("Failed to Rollback, will try again.");
      rollbackUpdateToStudentStudyLog(params);
    }
  });
}

const rollbackUpdateToBehaviorLogQuery = `DELETE FROM student_behavior_log 
 WHERE user_id = $userId AND behavior_id = $behaviorId AND date_of_event = $dateOfEvent;`;

function rollbackUpdateToBehaviorLog(params) {
  const { $userId, $behaviorId, $dateOfEvent } = params;

  if (!validateUser($userId))
    throw statusError("userId must be an integer", 400);

  if (!validateBehavior($behaviorId))
    throw statusError("behaviorId must be an integer", 400);

  if (!validateDateOfEvent($dateOfEvent))
    throw statusError("dateofEvent must be in format 'YYYY-MM-DD'", 400);

  db.run(rollbackUpdateToBehaviorLogQuery, params, (err) => {
    if (err) {
      console.error("Failed to Rollback, will try again.");
      rollbackUpdateToBehaviorLog(params);
    } else {
      console.log(
        `Behavior Event Removed: {userId: ${$userId}, behaviorId: ${$behaviorId}, dateOfEvent: ${$dateOfEvent}}`
      );
    }
  });
}

/* App Start */

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
