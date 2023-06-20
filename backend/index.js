const sqlite3 = require("sqlite3").verbose();
const express = require("express");
const app = express();

app.use(express.json()); //JSON to read headers

const port = 5000;

const Responses = require("./statusMessages");

/* Opens Database Connection */
const db = new sqlite3.Database("database/CompassDatabase.db");

/* Get User Information */
app.get("/api/users/:email", (req, res) => {
  const email = req.params.email;

  db.get("SELECT * FROM users WHERE email = ?", email, (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send(Responses[500]);
    } else if (row) {
      res.json(row);
    } else {
      res.status(404).send(Responses[404]);
    }
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

/* Get Skill Categories */
app.get("/api/skills/", (req, res) => {
  db.all("SELECT * FROM skills", (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send(Responses[500]);
    } else if (row) {
      res.json(row);
    } else {
      res.status(404).send(Responses[404]);
    }
  });
});

/* Get Mastery Log */
app.get("/api/skill_mastery/:user_id", (req, res) => {
  const userId = req.params.user_id;

  db.all(
    "SELECT * FROM skill_mastery_log WHERE user_id = ? ORDER BY skill_id, date_of_event",
    userId,
    (err, row) => {
      if (err) {
        console.error(err);
        res.status(500).send(Responses[500]);
      } else if (row) {
        res.json(row);
      } else {
        res.status(404).send("Skill Mastery not found for the specified user");
      }
    }
  );
});

/* Get Student Information */
app.get("/api/students/:user_id", (req, res) => {
  const userId = req.params.user_id;

  db.get("SELECT * FROM students WHERE user_id = ?", userId, (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send(Responses[500]);
    } else if (row) {
      res.json(row);
    } else {
      res.status(404).send(Responses[404]);
    }
  });
});

/* Get Student Study Hours */
app.get("/api/study_hours/:user_id", (req, res) => {
  const userId = req.params.user_id;

  db.all(
    "SELECT * FROM student_study_log WHERE user_id = ? ORDER BY date_of_event",
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

/* Get Student Bad Behaviors */
app.get("/api/behavior_events/:user_id", (req, res) => {
  const userId = req.params.user_id;

  db.all(
    "SELECT * FROM student_behavior_log WHERE user_id = ? ORDER BY date_of_event",
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

/* Get Behavior Categories */
app.get("/api/behaviors", (req, res) => {
  db.all("SELECT * FROM student_behaviors", (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send(Responses[500]);
    } else if (row) {
      res.json(row);
    } else {
      res.status(404).send(Responses[404]);
    }
  });
});

/* Get Behavior Consequences For Given Behavior */
app.get("/api/behavior_consequences/:behavior_id", (req, res) => {
  const behaviorId = req.params.behavior_id;

  db.get(
    "SELECT * FROM student_behavior_consequences WHERE behavior_id = ?",
    behaviorId,
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

const insertBehaviorQuery = `INSERT INTO student_behavior_log (user_id, behavior_id, date_of_event)
VALUES ($userId, $behaviorId, $dateOfEvent);`;

function insertBehavior(params) {
  const { $userId, $behaviorId, $dateOfEvent } = params;

  if (!validateUser($userId))
    throw statusError("userId must be an integer", 400);

  if (!validateBehavior($behaviorId))
    throw statusError("behaviorId must be an integer", 400);

  if (!validateDateOfEvent($dateOfEvent))
    throw statusError("dateofEvent must be in format 'YYYY-MM-DD'", 400);

  db.run(insertBehaviorQuery, params, (err) => {
    if (err) {
      console.error(err);
      throw new statusError("Database Rejected Query", 500);
    } else {
      console.log(
        `Behavior Event Logged As: ${
          (this.userId, this.behaviorId, this.dateOfEvent)
        }`
      );
    }
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

  try {
    insertBehavior(params);
  } catch (error) {
    console.error(error.message);
    res
      .status(error.statusCode)
      .json(formatResponse(error.statusCode, error.message));
  }

  try {
    updateStudentStudyHoursRemaining(userId);
  } catch (error) {
    console.error(error.message);
    res
      .status(error.statusCode)
      .json(formatResponse(error.statusCode, error.message));
    rollbackUpdateToBehaviorLog(params);
  }

  res.status(200).send(Responses[200]);
});

const insertSkillMasteryQuery = `INSERT INTO skill_mastery_log (user_id, skill_id, mastery_status, date_of_event) 
VALUES ($userId, $skillId, $masteryStatus, $dateOfEvent)`;

function insertSkillMastery(params) {
  const { $userId, $skillId, $masteryStatus, $dateOfEvent } = params;

  if (!validateUser($userId))
    throw statusError("userId must be an integer", 400);

  if (!validateSkill($skillId))
    throw statusError("skillId must be an integer", 400);

  if (!validateMasteryStatus($masteryStatus))
    throw statusError("masteryStatus must be an number between 0 and 5", 400);

  if (!validateDateOfEvent($dateOfEvent))
    throw statusError("dateofEvent must be in format 'YYYY-MM-DD'", 400);

  db.run(insertSkillMasteryQuery, params, (err) => {
    if (err) {
      console.error(err);
      throw statusError("Database Rejects Query", 500);
    } else {
      console.log(
        "Mastery Skill Logged As:" +
          `\n\t{user_id:${params.$userId}, skill_id:${params.$skillId}, mastery_status:${params.$masteryStatus}, date_of_event:${params.$dateOfEvent}}`
      );
    }
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

  try {
    insertSkillMastery(params);
  } catch (error) {
    console.log(error.message);
    res
      .status(error.statusCode)
      .json(formatResponse(error.statusCode, error.message));
  }

  res.status(200).send(Responses[200]);
});

const insertStudyHoursQuery = `INSERT INTO student_study_log (user_id, log_in_time, date_of_event) 
VALUES ($userId, $logInTime, $dateOfEvent)`;

function insertStudyHours(params) {
  const { $userId, $logInTime, $dateOfEvent } = params;

  if (!validateUser($userId)) {
    throw statusError("userId must be an integer", 400);
  }

  if (!validateStudyLoggingTime($logInTime)) {
    throw statusError("logInTime must be an integer between 0 and 1440.", 400);
  }

  if (!validateDateOfEvent($dateOfEvent)) {
    throw statusError("dateofEvent must be in format 'YYYY-MM-DD'", 400);
  }

  db.run(insertStudyHoursQuery, params, (err) => {
    if (err) {
      console.error(err);
      throw statusError("Database Rejected Query", 500);
    } else {
      console.log(
        `Study Hours Logged As:` +
          `\n\t{user_id: ${params.$userId}, log_in_time: ${params.$logInTime}, date_of_event: ${params.$dateOfEvent}}`
      );
    }
  });
}
/* Add Study Hours for a Specific Student */
app.post("/api/study_hours", (req, res) => {
  const { userId, logInTime, dateOfEvent } = req.body;

  const params = {
    $userId: userId,
    $logInTime: logInTime,
    $dateOfEvent: dateOfEvent,
  };

  try {
    insertStudyHours(params);
  } catch (error) {
    console.error(error.message);
    res
      .status(error.statusCode)
      .json(formatResponse(error.statusCode, error.message));

    return;
  }

  res.status(200).send(Responses[200]);
});

/* Update Study Hours for a Specific Student */

const updateStudyHoursLogQuery = `UPDATE student_study_log
SET log_out_time = $logOutTime AND study_duration = $studyDuration
WHERE user_id = $userId AND log_in_time = $logInTime AND date_of_event = $dateOfEvent`;

function updateStudyHoursLog(params) {
  const { $userId, $logInTime, $logOutTime, $dateOfEvent } = params;

  if (!validateUser($userId))
    throw statusError("userId must be an integer", 400);

  if (!validateDateOfEvent($dateOfEvent))
    throw statusError("dateofEvent must be in format 'YYYY-MM-DD'", 400);

  if (!validateStudyLoggingTime($logInTime))
    throw statusError("logInTime must be an integer between 0 and 1440.", 400);

  if (!validateStudyLoggingTime($logOutTime))
    throw statusError("logOutTime must be an integer between 0 and 1440.", 400);

  params.$studyDuration = $logOutTime - $logInTime;

  if (!validateStudyLoggingTime(params.$studyDuration))
    throw statusError(
      "Study duration must be an integer between 0 and 1440.",
      400
    );

  db.run(updateStudyHoursLogQuery, params, function (error) {
    if (error) {
      console.error(error);
      throw statusError("Database Rejected Query", 500);
    } else {
      console.log(
        `Log out time updated successfully for user ${params.userId}`
      );
    }
  });
}

app.patch("/api/study_hours/:user_id", (req, res) => {
  const userId = req.params.user_id;
  const { dateOfEvent, logInTime, logOutTime } = req.body;

  const params = {
    $userId: userId,
    $logInTime: logInTime,
    $dateOfEvent: dateOfEvent,
    $logOutTime: logOutTime,
  };

  try {
    updateStudyHoursLog(params);
  } catch (error) {
    console.error(error.message);
    res
      .status(error.statusCode)
      .json(formatResponse(error.statusCode, error.message));
  }

  try {
    updateStudentStudyHoursCompleted(params.$userId);
  } catch (error) {
    console.error(error.message);
    RollbackUpdateToStudentStudyLog();
    res
      .status(error.statusCode)
      .json(formatResponse(error.statusCode, error.message));
  }

  res.status(200).send(Responses[200]);
});

/* Sub Query For Updating Student Study Hours Completed*/

const sumStudentStudyTimeQuery = `SELECT SUM(study_duration)
  AS sumStudentStudyTime
  FROM student_study_log
  WHERE user_id = ?;`;

const updateStudentMinutesCompletedQuery = `UPDATE students
  SET study_minutes_completed = $studyMinutesCompleted
  WHERE user_id = $userId;`;

function updateStudentStudyHoursCompleted(userId) {
  let sumStudyMinutes = null;

  if (!validateUser(userId))
    throw statusError("userId must be an integer", 400);

  db.get(sumStudentStudyTimeQuery, userId, (err, row) => {
    if (err) {
      console.log(err);
      throw statusError("Database Rejected Query.", 500);
    } else if (row) {
      sumStudyMinutes = row.sumStudentStudyTime;

      if (!sumStudyMinutes)
        throw new statusError("No Study Hour Entries Found for User", 410);

      const params = {
        $userId: userId,
        $studyMinutesCompleted: sumStudyMinutes,
      };

      db.run(updateStudentMinutesCompletedQuery, params, (err) => {
        if (err) {
          console.log(err);
          throw statusError("Database Rejected Query.", 500);
        } else {
          console.log(`Study hours updated successfully for user ${userId}`);
        }
      });
    }
  });
}

/* Sub Query For Updating Student Study Hours Required*/

const baseStudentStudyTimeQuery = `SELECT (base_study_minutes) 
  FROM students
  WHERE user_id = ?;`;

const sumStudentRequiredStudyTime = `SELECT SUM(additional_study_minutes) 
  AS sumBehaviorMinutes
  FROM student_behavior_log
  JOIN student_behavior_consequences
  ON student_behavior_log.behavior_id=student_behavior_consequences.behavior_id
  WHERE user_id = ?;`;

const updateStudentMinutesRemainingQuery = `UPDATE students
  SET study_minutes_required = $sumBehaviorMinutes
  WHERE user_id = $userId`;

function updateStudentStudyHoursRemaining(userId) {
  let baseStudentMinutes,
    sumBehaviorMinutes = null;

  if (!validateUser(userId))
    throw statusError("userId must be an integer", 400);

  db.get(baseStudentStudyTimeQuery, userId, (err, row) => {
    if (err) {
      console.log(err);
      throw statusError("Database Rejected Query.", 500);
    } else if (row) {
      baseStudentMinutes = row.base_study_minutes;
      console.log();

      if (!baseStudentMinutes)
        throw ReferenceError("No Base Study Hours Found for User", 410);

      db.get(sumStudentRequiredStudyTime, userId, (err, row) => {
        if (err) {
          console.log(err);
          throw statusError("Database Rejected Query.", 500);
        } else if (row) {
          sumBehaviorMinutes = row.sumBehaviorMinutes;

          if (!sumBehaviorMinutes)
            throw ReferenceError("No Behaviors Found for User", 410);

          sumBehaviorMinutes += baseStudentMinutes;
          const params = {
            $userId: userId,
            $sumBehaviorMinutes: sumBehaviorMinutes,
          };

          db.run(updateStudentMinutesRemainingQuery, params, (err) => {
            if (err) {
              console.log(err);
              throw statusError("Database Rejected Query.", 500);
            } else {
              console.log(
                `Study hours remaining updated successfully for user ${userId}`
              );
            }
          });
        }
      });
    }
  });
}

/* Rollback Functions for when one transaction passes but another fails. */

const rollbackUpdateToStudentStudyLogQuery = `UPDATE student_study_hours
  SET log_out_time = NULL AND study_duration = NULL,
  WHERE user_id = $userId AND log_in_time = $logInTime AND dateOfEvent = $dateOfEvent`;

function RollbackUpdateToStudentStudyLog(params) {
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
      RollbackUpdateToStudentStudyLog(params);
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
    }
  });
}

/* Validation Functions */

function validateUser(userId) {
  /*TODO: Ensure id exists */
  return Number.isInteger(userId);
}

function validateBehavior(behaviorId) {
  /*TODO: Ensure id exists */
  return Number.isInteger(behaviorId);
}

function validateSkill(skillId) {
  /*TODO: Ensure id exists */
  return Number.isInteger(skillId);
}

function validateMasteryStatus(masteryStatus) {
  return masteryStatus < 0 && masteryStatus <= 5;
}

function validateStudyLoggingTime(logTime) {
  if (!Number.isInteger(logTime)) return false;

  return logTime > 0 && logTime <= 1440;
}
function validateDateOfEvent(dateOfEvent) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  return dateRegex.test(dateOfEvent);
}

/* Status Error Constructor */
function statusError(message, status) {
  const error = new Error(message);
  error.statusCode = status;
  return error;
}

/* API OutPut Formatter */
function formatResponse(errorCode, additionalMessage = "No details provided.") {
  const response = {
    response: errorCode || 500,
    error: Responses[errorCode] || Responses[500],
    message: additionalMessage,
  };
  return response;
}

/* App Start */

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
