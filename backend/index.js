const sqlite3 = require("sqlite3").verbose();
const express = require("express");
const app = express();
const port = 5000;

/* Opens Database Connection */
const db = new sqlite3.Database("database/CompassDatabase.db");

/* User Queries */
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
