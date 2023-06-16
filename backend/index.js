const sqlite3 = require("sqlite3").verbose();
const express = require("express");
const app = express();
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
  /* VALIDITY CHECK */

  db.run(insertBehaviorQuery, params, (err) => {
    if (err) {
      console.error(err);
      throw new Error("Database Rejected Query");
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
app.post("api/behavior_events", (req, res) => {
  const { userId, behaviorId, dateOfEvent } = req.body;

  const params = {
    $userId: userId,
    $behaviorId: behaviorId,
    $dateOfEvent: dateOfEvent,
  };

  try {
    insertBehavior(params);
  } catch (error) {
    /* TODO: Response for 404 */
    console.error(error);
    res.status(500).send(Responses[500]);
  }

  try {
    updateStudentStudyHoursRemaining(userId);
  } catch (error) {
    console.error(error);
    res.status(500).send(Responses[500]);
    rollbackUpdateToBehaviorLog(params);
  }
});

const insertSkillMasteryQuery = `INSERT INTO skill_mastery_log (user_id, skill_id, mastery_status, date_of_event) 
VALUES ($userId, $skillId, $masteryStatus, $dateOfEvent)`;

function insertSkillMastery(params) {
  /* TODO: Validity Check */

  db.run(insertSkillMasteryQuery, params, (err) => {
    if (err) {
      console.error(err);
      throw new Error("Database Reject Query");
    } else {
      console.log(
        `Mastery Skill Logged As: ${
          (this.userId, this.skillId, this.masteryStatus, this.dateOfEvent)
        }`
      );
    }
  });
}

/* Add a Mastery Event to a Specific Student */
app.post("api/skill_mastery", (req, res) => {
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
    console.log(error);
    res.status(500).send(Responses[500]);
  }
});

const insertStudyHoursQuery = `INSERT INTO study_hours (user_id, log_in_time, date_of_event) 
VALUES ($userId, $logInTime, $dateOfEvent)`;

function insertStudyHours(params) {
  /* TODO: Validity Check */

  db.run(insertStudyHoursQuery, params, (err) => {
    if (err) {
      console.error(err);
      throw new Error("Database Rejected Query");
    } else {
      console.log(
        `Study Hours Logged As: ${
          (this.userId, this.logInTime, this.dateOfEvent)
        }`
      );
    }
  });
}
/* Add Study Hours for a Specific Student */
app.post("api/study_hours", (req, res) => {
  const { userId, logInTime, dateOfEvent } = req.body;

  const params = {
    $userId: userId,
    $logInTime: logInTime,
    $dateOfEvent: dateOfEvent,
  };

  try {
    insertStudyHours(params);
  } catch (error) {
    console.err(error);
    res.status(500).send(Responses[500]);
  }
});

/* Update Study Hours for a Specific Student */

const updateStudyHoursLogQuery = `UPDATE student_study_hours
SET log_out_time = $logOutTime AND study_duration = $studyDuration,
WHERE user_id = $userId AND log_in_time = $logInTime AND dateOfEvent = $dateOfEvent`;

function updateStudyHoursLog(params) {
  const { $logInTime, $logOutTime } = params;

  params.$studyDuration = $logInTime - $logOutTime;

  db.run(updateStudyHoursLogQuery, params, function (error) {
    if (error) {
      console.error(error);
      throw new Error("Database Rejected Query");
    } else {
      console.log(`Log out time updated successfully for user ${userId}`);
    }
  });
}

app.patch("api/study_hours/:user_id", (req, res) => {
  const userId = req.params.user_id;
  const { dateOfEvent, logInTime, logOutTime } = req.body;

  /* TODO: Input Validation */

  const params = {
    $userId: userId,
    $logInTime: logInTime,
    $dateOfEvent: dateOfEvent,
    $logOutTime: logOutTime,
  };

  try {
    updateStudyHoursLog(params);
  } catch (error) {
    console.err(error);
    res.status(500).send(Responses[500]);
  }

  try {
    updateStudentStudyHoursCompleted(params);
  } catch (error) {
    console.err(error);
    RollbackUpdateToStudentStudyLog();
    res.status(500).send(Responses[500]);
  }
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

  db.get(sumStudentStudyTimeQuery, userId, (err, row) => {
    if (err) {
      console.log(err);
      throw new Error("Database Rejected Query.");
    } else if (row) {
      sumStudyMinutes = row.sumStudentStudyTime;
    }
  });

  if (!sumStudyMinutes)
    throw new ReferenceError("No Study Hour Entries Found for User");

  const params = {
    $userId: userId,
    $studyMinutesCompleted: sumStudyMinutes,
  };

  db.run(updateStudentMinutesCompletedQuery, params, (err) => {
    if (err) {
      console.log(err);
      throw new Error("Database Rejected Query.");
    } else {
      console.log(`Study hours updated successfully for user ${userId}`);
    }
  });
}

/* Sub Query For Updating Student Study Hours Required*/

const baseStudentStudyTimeQuery = `SELECT (student_base_minutes) 
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

  db.get(baseStudentStudyTimeQuery, userId, (err, row) => {
    if (err) {
      console.log(err);
      throw new Error("Database Rejected Query.");
    } else if (row) {
      baseStudentMinutes = row.sumBehaviorMinutes;
    }
  });

  if (!baseStudentMinutes)
    throw ReferenceError("No Base Study Hours Found for User");

  db.get(sumStudentRequiredStudyTime, userId, (err, row) => {
    if (err) {
      console.log(err);
      throw new Error("Database Rejected Query.");
    } else if (row) {
      sumBehaviorMinutes = row;
    }
  });

  if (!sumBehaviorMinutes) throw ReferenceError("No Behaviors Found for User");

  sumBehaviorMinutes += baseStudentMinutes;

  const params = {
    $userId: userId,
    $sumBehaviorMinutes: sumBehaviorMinutes,
  };

  db.run(updateStudentMinutesRemainingQuery, params, (err) => {
    if (err) {
      console.log(err);
      throw new Error("Database Rejected Query.");
    } else {
      console.log(
        `Study hours remaining updated successfully for user ${userId}`
      );
    }
  });
}

/* Rollback Functions for when one transaction passes but another fails. */

const rollbackUpdateToStudentStudyLogQuery = `UPDATE student_study_hours
  SET log_out_time = NULL AND study_duration = NULL,
  WHERE user_id = $userId AND log_in_time = $logInTime AND dateOfEvent = $dateOfEvent`;

function RollbackUpdateToStudentStudyLog(params) {
  //TODO: Input validation

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
  //TODO: Input Validation

  db.run(rollbackUpdateToBehaviorLogQuery, params, (err) => {
    if (err) {
      console.error("Failed to Rollback, will try again.");
      rollbackUpdateToBehaviorLog(params);
    }
  });
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
