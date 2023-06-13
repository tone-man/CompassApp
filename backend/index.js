const sqlite3 = require("sqlite3").verbose();
const express = require("express");
const app = express();
const port = 5000;

/* Opens Database Connection */
const db = new sqlite3.Database("database/CompassDatabase.db");

/* Get User Information */
app.get("/api/users/:email", (req, res) => {
  const email = req.params.email;

  db.get("SELECT * FROM users WHERE email = ?", email, (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else if (row) {
      res.json(row);
    } else {
      res.status(404).send("A user registered with that email was not found.");
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
        res.status(500).send("Internal Server Error");
      } else if (row) {
        res.json(row);
      } else {
        res.status(404).send("The user specified does not have a role.");
      }
    }
  );
});

/* Get Skill Categories */
app.get("/api/skills/", (req, res) => {
  db.all("SELECT * FROM skills", (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else if (row) {
      res.json(row);
    } else {
      res.status(404).send("Skill Types Not Found");
    }
  });
});

/* Get Mastery Log */
app.get("/api/skill_mastery/:user_id", (req, res) => {
  const userId = req.params.user_id;

  db.all(
    "SELECT * FROM skill_mastery_log WHERE user_id = ? ORDER BY date_of_event",
    userId,
    (err, row) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
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
      res.status(500).send("Internal Server Error");
    } else if (row) {
      res.json(row);
    } else {
      res
        .status(404)
        .send("Student Information not found for the specified user");
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
        res.status(500).send("Internal Server Error");
      } else if (row) {
        res.json(row);
      } else {
        res.status(404).send("Study Hours not found for the specified user");
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
        res.status(500).send("Internal Server Error");
      } else if (row) {
        res.json(row);
      } else {
        res
          .status(404)
          .send("Behavior events not found for the specified user");
      }
    }
  );
});

/* Get Behavior Categories */
app.get("/api/behaviors", (req, res) => {
  db.all("SELECT * FROM student_behaviors", (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else if (row) {
      res.json(row);
    } else {
      res.status(404).send("Behaviors not found.");
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
        res.status(500).send("Internal Server Error");
      } else if (row) {
        res.json(row);
      } else {
        res.status(404).send("Behaviors not found.");
      }
    }
  );
});

/* Add a Behavior to a Specific Student */
app.post("api/behavior_events", (req, res) => {
  const { userId, behaviorId, dateOfEvent } = req.body;

  /* TODO: Validity Check */

  db.run(
    "INSERT INTO student_behavior_log (user_id, behavior_id, date_of_event)" +
      " VALUES (?, ?, ?)",
    userId,
    behaviorId,
    dateOfEvent,
    (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
      } else {
        console.log(
          `Behavior Event Logged As: ${
            (this.userId, this.behaviorId, this.dateOfEvent)
          }`
        );
      }
    }
  );
});

/* Add a Mastery Event to a Specific Student */
app.post("api/skill_mastery", (req, res) => {
  const { userId, skillId, masteryStatus, dateOfEvent } = req.body;

  /* TODO: Validity Check */

  db.run(
    "INSERT INTO skill_mastery_log (user_id, skill_id, mastery_status, date_of_event)" +
      " VALUES (?, ?, ?, ?)",
    userId,
    skillId,
    masteryStatus,
    dateOfEvent,
    (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
      } else {
        console.log(
          `Mastery Skill Logged As: ${
            (this.userId, this.skillId, this.masteryStatus, this.dateOfEvent)
          }`
        );
      }
    }
  );
});

/* Add Study Hours for a Specific Student */
app.post("api/study_hours", (req, res) => {
  const { userId, logInTime, dateOfEvent } = req.body;

  /* TODO: Validity Check */

  db.run(
    "INSERT INTO study_hours (user_id, log_in_time, date_of_event)" +
      " VALUES (?, ?, ?)",
    userId,
    logInTime,
    dateOfEvent,
    (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
      } else {
        console.log(
          `Study Hours Logged As: ${
            (this.userId, this.logInTime, this.dateOfEvent)
          }`
        );
      }
    }
  );
});

/* UPDATE BEHAVIOR LOG */
app.patch("api/study_hours/:user_id", (req, res) => {
  const userId = req.params.user_id;
  const { dateOfEvent, logInTime, logOutTime } = req.body;

  const params = {
    $userId: userId,
    $logInTime: logInTime,
    $dateOfEvent: dateOfEvent,
    $logOutTime: logOutTime,
  };

  db.run(
    `UPDATE yourTable
    SET logOutTime = $logOutTime
    WHERE userId = $userId AND logInTime = $logInTime AND dateOfEvent = $dateOfEvent`,
    params,
    function (error) {
      if (error) {
        console.error(error.message);
        res.status(500).send(`Internal Server Error.`);
      } else {
        console.log(`Log out time updated successfully for user ${userId}`);
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
