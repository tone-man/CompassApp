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
    "SELECT * FROM skill_mastery_log WHERE user_id = ?",
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
