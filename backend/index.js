const sqlite3 = require("sqlite3").verbose();
const express = require("express");
const app = express();
const port = 5000;

/* Opens Database Connection */
const db = new sqlite3.Database("database/CompassDatabase.db");

app.get("/api/users", (req, res) => {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.json(rows);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
