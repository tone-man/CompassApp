const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { body, param, validationResult } = require("express-validator");
const app = express();
const cors = require("cors");
app.use(express.json()); //JSON to read headers
// Enable CORS for all routes
app.use(cors());

const port = 5000;
const route = "/api/v1";

const Responses = require("./statusMessages");
const { statusError, formatResponse } = require("./utils");

const {
  createUser,
  getUserById,
  createSkillMasteryLog,
  createBehavior,
  createBehaviorConsequence,
  createBehaviorLog,
  updateBehavior,
  updateBehaviorConsequence,
  deleteBehavior,
  deleteBehaviorConsequence,
  getBehaviorById,
  getAllStudentBehaviors,
  getAllBehaviorConsequences,
  getBehaviorConsequenceById,
  getAllStudentBehaviorsWithConsequences,
  getBehaviorLogByStudent,
  getBehaviorLogById,
  updateBehaviorLog,
  deleteBehaviorLog,
  createMasterySkill,
  getMasterySkillById,
  getAllMasterySkills,
  updateMasterySkill,
  deleteMasterySkill,
  getSkillMasteryByStudent,
  updateSkillMasteryLog,
  deleteSkillMasteryLog,
  createStudyLog,
  updateStudyLog,
  getStudyHoursByStudent,
  deleteStudyLog,
  createUserRole,
  createStudent,
  updateUser,
  deleteUser,
  deleteUserRoleMapping,
  getUserRoleMapping,
  deleteStudent,
  updateUserRoleMapping,
  getStudentById,
  getAllStudents,
  getBaseStudyTime,
  getSumStudentRequiredStudyTime,
  updateStudentRequiredStudyTime,
  getSumStudentCompletedStudyTime,
  updateStudentCompletedStudyTime,
  getAllUsers,
  getUserByEmail,
} = require("./databaseQueries");

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

/**
 * USERS ENDPOINT
 */

// POST Create Users

const validateCreateUser = [
  body("name").trim().isLength({ min: 1 }).withMessage("Name is required"),
  body("email").trim().isEmail().withMessage("Invalid email format"),
  body("userRole")
    .isInt({ min: 1, max: 3 })
    .withMessage("Role must be greater than 0"),
];

app.post(
  route + "/users",
  validateCreateUser,
  handleValidationErrors,
  (req, res) => {
    const { name, email, userRole } = req.body;

    createUser(db, name, email)
      .then((result) => {
        createUserRole(db, result.id, userRole);
        return result.id;
      })
      .then((result) => {
        if (userRole == 1) return createStudent(db, result, 0, 1200, 1200);
        return result;
      })
      .then((result) => {
        res
          .status(201)
          .json({ id: result, message: "User created successfully" });
      })
      .catch((error) => {
        console.error("Error creating user:", error);
        res
          .status(500)
          .json({ error: "An error occurred while creating the user" });
      });
  }
);

// GET User by Id

app.get(
  route + "/users/:id",
  [param("id").isInt().toInt()],
  handleValidationErrors,
  (req, res) => {
    const userId = req.params.id;

    getUserById(db, userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
      })
      .catch((error) => {
        console.log(error);
        res
          .status(500)
          .json({ error: "An error occurred while fetching the user" });
      });
  }
);

// Get All Users
app.get(route + "/users", (req, res) => {
  getAllUsers(db).then((results) => {
    if (results.length <= 0) res.status(404).json({ error: "No Users Found" });
    else res.json(results);
  });
});

//Get User By Email
app.get(
  route + "/users-email/:email",
  [param("email").trim().isEmail().withMessage("Invalid email format")],
  handleValidationErrors,
  (req, res) => {
    const email = req.params.email;
    getUserByEmail(db, email)
      .then((result) => {
        if (!result) res.status(404).json({ error: "No User Found" });
        else res.json(result);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      });
  }
);

// UPDATE USER INFO By Id

const validateUpdateUser = [
  param("userId").isInt(),
  body("name").trim().isLength({ min: 1 }).withMessage("Name is required"),
  body("email").trim().isEmail().withMessage("Invalid email format"),
];

app.put(
  route + "/users/:userId",
  validateUpdateUser,
  handleValidationErrors,
  (req, res) => {
    const userId = req.params.userId;
    const { email, name } = req.body;

    updateUser(db, userId, name, email)
      .then((result) => {
        res.status(201).json({ result });
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal server error" });
      });
  }
);

// DELETE User By ID

app.delete(
  route + "/users/:id",
  [param("id").isInt().toInt()],
  handleValidationErrors,
  (req, res) => {
    const userId = req.params.id;
    getUserRoleMapping(db, userId)
      .then((row) => {
        if (row.role_id == 1) return deleteStudent(db, userId);

        return row;
      })
      .then(deleteUserRoleMapping(db, userId))
      .then(deleteUser(db, userId))
      .then(() => {
        res.status(204).end(); // Successfully deleted
      })
      .catch((error) => {
        console.log(error);
        res
          .status(500)
          .json({ error: "An error occurred while deleting the user." });
      });
  }
);

/**
 * USER-ROLES ENDPOINT
 */

// Update Role Mapping by User Id

app.put(
  route + "/user-roles/:id",
  [param("id").isInt({ min: 0 }), body("newRoleId").isInt({ min: 0 })],
  handleValidationErrors,
  (req, res) => {
    const userId = req.params.id;
    const { newRoleId } = req.body;

    getUserRoleMapping(db, userId)
      .then((row) => {
        if (row.role_id != newRoleId && newRoleId == 1)
          return createStudent(db, userId, 0, 1200, 1200);
        if (row.role_id != newRoleId && row.role_id == 1)
          return deleteStudent(db, userId);

        return row;
      })
      .then(updateUserRoleMapping(db, userId, newRoleId))
      .then((result) => {
        res.status(201).json({ result });
      })
      .catch((error) => {
        console.error("Error updating user role mapping:", error);
        res.status(500).json({ error: "Internal server error" });
      });
  }
);

/**
 * STUDENTS ENDPOINT
 */

//Get Student By Id
app.get(
  route + "/students/:id",
  [param("id").isInt().toInt()],
  handleValidationErrors,
  (req, res) => {
    const studentId = req.params.id;

    getStudentById(db, studentId)
      .then((student) => {
        if (!student) {
          return res.status(404).json({ error: "Student not found" });
        }
        res.json(student);
      })
      .catch((error) => {
        console.log(error);
        res
          .status(500)
          .json({ error: "An error occurred while fetching the Student" });
      });
  }
);

//Get All Students

app.get(route + "/students", (req, res) => {
  getAllStudents(db).then((results) => {
    if (results.length <= 0)
      res.status(404).json({ error: "No Students Found" });
    else res.json(results);
  });
});

/**
 * MASTERY-SKILLS ENDPOINT
 */

// CREATE New Skill

const validateCreateSkill = [
  body("name").trim().isLength({ min: 1 }).withMessage("name is required"),
];

app.post(
  route + "/skills",
  validateCreateSkill,
  handleValidationErrors,
  (req, res) => {
    const { name } = req.body;

    createMasterySkill(db, name)
      .then((result) => {
        res.status(201).json({ result });
      })
      .catch((error) => {
        console.error("Error creating skill:", error);
        res.status(500).json({ error: "Internal server error" });
      });
  }
);

// GET Skill by Id

app.get(
  route + "/skills/:skillId",
  [param("skillId").isInt().toInt()],
  handleValidationErrors,
  (req, res) => {
    const skillId = req.params.skillId;

    getMasterySkillById(db, skillId)
      .then((skill) => {
        if (!skill) {
          return res.status(404).json({ error: "Skill not found" });
        }
        res.json(skill);
      })
      .catch((error) => {
        console.log(error);
        res
          .status(500)
          .json({ error: "An error occurred while fetching the skill" });
      });
  }
);

// GET All Skill

app.get(route + "/skills", (req, res) => {
  getAllMasterySkills(db).then((results) => {
    if (results.length <= 0) res.status(404).json({ error: "No Skills Found" });
    else res.json(results);
  });
});

// UPDATE Skill

const validateUpdateSkill = [
  param("skillId").isInt(),
  body("name").trim().isLength({ min: 1 }).withMessage("name is required"),
];

app.put(
  route + "/skills/:skillId",
  validateUpdateSkill,
  handleValidationErrors,
  (req, res) => {
    const skillId = req.params.skillId;
    const name = req.body.name;
    updateMasterySkill(db, skillId, name)
      .then((result) => {
        res.status(201).json({ result });
      })
      .catch((error) => {
        console.error("Error updating skill:", error);
        res.status(500).json({ error: "Internal server error" });
      });
  }
);

// DELETE Behavior Category

app.delete(
  route + "/skills/:skillId",
  [param("skillId").isInt().toInt()],
  handleValidationErrors,
  (req, res) => {
    const skillId = req.params.skillId;

    deleteMasterySkill(db, skillId)
      .then(() => {
        res.status(204).end(); // Successfully deleted
      })
      .catch((error) => {
        res
          .status(500)
          .json({ error: "An error occurred while deleting the skill." });
      });
  }
);

/**
 * MASTERY-SKILL-LOGS ENDPOINT
 */

// POST Create Mastery Log

const validateCreateMastery = [
  body("userId").isInt(),
  body("skillId").isInt(),
  body("masteryStatus").isFloat({ min: 0, max: 5 }),
  // body("dateOfEvent").isISO8601(), TODO
];

app.post(
  route + "/mastery-logs",
  validateCreateMastery,
  handleValidationErrors,
  (req, res) => {
    const { userId, skillId, masteryStatus, dateOfEvent } = req.body;

    createSkillMasteryLog(db, userId, skillId, masteryStatus, dateOfEvent)
      .then((result) => {
        res.status(201).json({ id: result.entryId });
      })
      .catch((error) => {
        console.error("Error creating skill mastery log:", error);
        res.status(500).json({ error: "Internal server error" });
      });
  }
);

// GET Mastery Logs By Student

app.get(
  route + "/students/:studentId/mastery-logs",
  [param("studentId").isInt().toInt()],
  handleValidationErrors,
  (req, res) => {
    const studentId = req.params.studentId;

    getSkillMasteryByStudent(db, studentId)
      .then((results) => {
        if (results.length <= 0) {
          return res
            .status(404)
            .json({ error: "Behavior log not found for student" });
        }
        res.json(results);
      })
      .catch((error) => {
        console.log(error);
        res
          .status(500)
          .json({ error: "An error occurred while fetching the behavior" });
      });
  }
);

// UPDATE Mastery Log by ID

const validateUpdateMasteryLog = [
  param("entryId").isInt(),
  body("masteryStatus").isFloat({ min: 0, max: 5 }),
];

app.put(
  route + "/mastery-logs/:entryId",
  validateUpdateMasteryLog,
  handleValidationErrors,
  (req, res) => {
    const entryId = req.params.entryId;
    const { masteryStatus } = req.body;

    updateSkillMasteryLog(db, entryId, masteryStatus)
      .then((result) => {
        res.status(201).json({ result });
      })
      .catch((error) => {
        console.error("Error updating behavior:", error);
        res.status(500).json({ error: "Internal server error" });
      });
  }
);

// DELETE Mastery Log By ID
app.delete(
  route + "/mastery-logs/:entryId",
  [param("entryId").isInt().toInt()],
  handleValidationErrors,
  (req, res) => {
    const entryId = req.params.entryId;

    deleteSkillMasteryLog(db, entryId)
      .then(() => {
        res.status(204).end(); // Successfully deleted
      })
      .catch((error) => {
        console.log(error);
        res
          .status(500)
          .json({ error: "An error occurred while deleting the behavior." });
      });
  }
);

/**
 * BEHAVIORS ENDPOINT
 */

// POST Create Behavior

const validateCreateBehavior = [
  body("behavior")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Behavior is required"),
  body("additionalStudyTime").isInt({ min: 0 }),
];

app.post(
  route + "/behaviors",
  validateCreateBehavior,
  handleValidationErrors,
  (req, res) => {
    const { behavior, additionalStudyTime } = req.body;

    createBehavior(db, behavior)
      .then((result) =>
        createBehaviorConsequence(db, result.behaviorId, additionalStudyTime)
      )
      .then((result) => {
        res.status(201).json({ result });
      })
      .catch((error) => {
        console.error("Error creating behavior:", error);
        res.status(500).json({ error: "Internal server error" });
      });
  }
);

// GET Behavior by Id

app.get(
  route + "/behaviors/:behaviorId",
  [param("behaviorId").isInt().toInt()],
  handleValidationErrors,
  (req, res) => {
    const behaviorId = req.params.behaviorId;

    getBehaviorById(db, behaviorId)
      .then((behavior) => {
        if (!behavior) {
          return res.status(404).json({ error: "Behavior not found" });
        }
        res.json(behavior);
      })
      .catch((error) => {
        console.log(error);
        res
          .status(500)
          .json({ error: "An error occurred while fetching the behavior" });
      });
  }
);

// GET All Behaviors Only

app.get(route + "/behaviors", (req, res) => {
  getAllStudentBehaviors(db).then((results) => {
    if (results.length <= 0)
      res.status(404).json({ error: "No Student Behaviors Found" });
    else res.json(results);
  });
});

// GET All Behaviors With Consequences

app.get(route + "/behaviors-verbose", (req, res) => {
  getAllStudentBehaviorsWithConsequences(db).then((results) => {
    if (results.length <= 0)
      res.status(404).json({ error: "No Student Behaviors Found" });
    else res.json(results);
  });
});

// UPDATE Behavior

const validateUpdateBehavior = [
  param("behaviorId").isInt(),
  body("behavior")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Behavior is required"),
  body("additionalStudyTime").isInt({ min: 0 }),
];

app.put(
  route + "/behaviors/:behaviorId",
  validateUpdateBehavior,
  handleValidationErrors,
  (req, res) => {
    const behaviorId = req.params.behaviorId;
    const { behavior, additionalStudyTime } = req.body;
    updateBehavior(db, behaviorId, behavior)
      .then(updateBehaviorConsequence(db, behaviorId, additionalStudyTime))
      .then((result) => {
        res.status(201).json({ result });
      })
      .catch((error) => {
        console.error("Error updating behavior:", error);
        res.status(500).json({ error: "Internal server error" });
      });
  }
);

// DELETE Behavior Category

app.delete(
  route + "/behaviors/:behaviorId",
  [param("behaviorId").isInt().toInt()],
  handleValidationErrors,
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const behaviorId = req.params.behaviorId;

    deleteBehavior(db, behaviorId)
      .then(deleteBehaviorConsequence(db, behaviorId))
      .then(() => {
        res.status(204).end(); // Successfully deleted
      })
      .catch((error) => {
        res
          .status(500)
          .json({ error: "An error occurred while deleting the behavior." });
      });
  }
);

/**
 * BEHAVIOR CONSEQUENCES ENDPOINT
 */

// GET Consequences By Id
app.get(
  route + "/behavior-consequences/:behaviorId",
  [param("behaviorId").isInt()],
  handleValidationErrors,
  (req, res) => {
    const behaviorId = req.params.behaviorId;

    getBehaviorConsequenceById(db, behaviorId)
      .then((consequence) => {
        if (!consequence) {
          return res.status(404).json({ error: "Consequence not found" });
        }
        res.json(consequence);
      })
      .catch((error) => {
        console.log(error);
        res
          .status(500)
          .json({ error: "An error occurred while fetching the consequence" });
      });
  }
);

// Get All Consequences

app.get(route + "/behavior-consequences", (req, res) => {
  getAllBehaviorConsequences(db).then((results) => {
    if (results.length <= 0)
      res.status(404).json({ error: "No Student Behaviors Found" });
    else res.json(results);
  });
});

/**
 * BEHAVIOR-LOGS ENDPOINT
 */

// POST Create Log

const validateCreateBehaviorLog = [
  body("userId").isInt().notEmpty(),
  body("behaviorId").isInt().notEmpty(),
  // TODO body("dateOfEvent").isDate().notEmpty(),
];

app.post(
  route + "/behavior-logs",
  validateCreateBehaviorLog,
  handleValidationErrors,
  (req, res) => {
    const { userId, behaviorId, dateOfEvent } = req.body;
    let baseStudyTime = 1200;
    let entryId = 0;
    createBehaviorLog(db, userId, behaviorId, dateOfEvent)
      .then((result) => {
        entryId = result.entryId;
        return getBaseStudyTime(db, userId);
      })
      .then((base) => {
        baseStudyTime = base;
        return getSumStudentRequiredStudyTime(db, userId);
      })
      .then((sum) => {
        updateStudentRequiredStudyTime(db, userId, baseStudyTime + sum);
      })
      .then((result) => {
        res.status(201).json({id: entryId, mossage: "Behavior Log Created Successfully."});
      })
      .catch((error) => {
        res.status(500).json({
          error: "An error occurred while creating the behavior log entry.",
        });
      });
  }
);

// GET Log By Entry ID

app.get(
  route + "/behavior-logs/:entryId",
  [param("entryId").isInt()],
  handleValidationErrors,
  (req, res) => {
    const entryId = req.params.entryId;

    getBehaviorLogById(db, entryId)
      .then((behavior) => {
        if (!behavior) {
          return res.status(404).json({ error: "Behavior not found" });
        }
        res.json(behavior);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          error: "An error occurred while fetching the behavior entry",
        });
      });
  }
);

// GET Logs By Student ID

app.get(
  route + "/students/:studentId/behavior-logs",
  [param("studentId").isInt().toInt()],
  handleValidationErrors,
  (req, res) => {
    const studentId = req.params.studentId;

    getBehaviorLogByStudent(db, studentId)
      .then((results) => {
        if (results.length <= 0) {
          return res
            .status(404)
            .json({ error: "Behavior log not found for student" });
        }
        res.json(results);
      })
      .catch((error) => {
        console.log(error);
        res
          .status(500)
          .json({ error: "An error occurred while fetching the behavior" });
      });
  }
);

// UPDATE Log by Entry ID

const validateUpdateBehaviorLog = [
  body("userId").isInt().notEmpty(),
  body("behaviorId").isInt().notEmpty(),
  // TODO body("dateOfEvent").isDate().notEmpty(),
];

app.put(
  route + "/behavior-logs/:entryId",
  validateUpdateBehaviorLog,
  handleValidationErrors,
  (req, res) => {
    const entryId = req.params.entryId;
    const { userId, behaviorId, dateOfEvent } = req.body;

    updateBehaviorLog(db, entryId, userId, behaviorId, dateOfEvent)
      .then((result) => {
        res.status(201).json({ result });
      })
      .catch((error) => {
        console.error("Error updating behavior:", error);
        res.status(500).json({ error: "Internal server error" });
      });
  }
);

// DELETE Log By Entry ID
app.delete(
  route + "/behavior-logs/:entryId",
  [param("entryId").isInt().toInt()],
  handleValidationErrors,
  (req, res) => {
    const entryId = req.params.entryId;

    deleteBehaviorLog(db, entryId)
      .then(() => {
        res.status(204).end(); // Successfully deleted
      })
      .catch((error) => {
        console.log(error);
        res
          .status(500)
          .json({ error: "An error occurred while deleting the behavior." });
      });
  }
);

/**
 * STUDENT-STUDY-LOG ENDPOINT
 */

// Post Create Study Hours Log
const validateCreateStudyHoursLog = [
  body("userId").isInt({ min: 0 }),
  // TODO body("dateTimeOfLogIn").isISO8601(),
  // TODO body("dateTimeOfLogOut").isISO8601(),
  body("durationOfStudy").isInt({ min: 0 }),
];

app.post(
  route + "/study-hour-logs",
  validateCreateStudyHoursLog,
  handleValidationErrors,
  (req, res) => {
    const { userId, dateTimeOfLogIn, dateTimeOfLogOut, durationOfStudy } =
      req.body;
    let entryId = 0;
    createStudyLog(
      db,
      userId,
      dateTimeOfLogIn,
      dateTimeOfLogOut,
      durationOfStudy
    )
      .then((result) => {
        entryId = result;
        return getSumStudentCompletedStudyTime(db, userId);
      })
      .then((sum) => {
        updateStudentCompletedStudyTime(db, userId, sum);
      })
      .then((result) => {
        res.status(201).json({ id: entryId, result: result });
      })
      .catch((error) => {
        console.error("Error creating skill:", error);
        res.status(500).json({ error: "Internal server error" });
      });
  }
);

// GET Study Hour Logs By Student ID

app.get(
  route + "/students/:studentId/study-hour-logs",
  [param("studentId").isInt().toInt()],
  handleValidationErrors,
  (req, res) => {
    const studentId = req.params.studentId;

    getStudyHoursByStudent(db, studentId)
      .then((results) => {
        if (results.length <= 0) {
          return res
            .status(404)
            .json({ error: "Behavior log not found for student" });
        }
        res.json(results);
      })
      .catch((error) => {
        console.log(error);
        res
          .status(500)
          .json({ error: "An error occurred while fetching the behavior" });
      });
  }
);

// UPDATE Study Hour Log by Entry ID

const validateUpdateStudyHourLog = [
  param("entryId").isInt({ min: 0 }),
  // TODO body("dateTimeOfLogIn").isISO8601(),
  // TODO body("dateTimeOfLogOut").isISO8601(),
  body("durationOfStudy").isInt({ min: 0 }),
];

app.put(
  route + "/study-hour-logs/:entryId",
  validateUpdateStudyHourLog,
  handleValidationErrors,
  (req, res) => {
    const entryId = req.params.entryId;
    const { dateTimeOfLogIn, dateTimeOfLogOut, durationOfStudy } = req.body;

    updateStudyLog(
      db,
      entryId,
      dateTimeOfLogIn,
      dateTimeOfLogOut,
      durationOfStudy
    )
      .then((result) => {
        res.status(201).json({ result });
      })
      .catch((error) => {
        console.error("Error updating study hours:", error);
        res.status(500).json({ error: "Internal server error" });
      });
  }
);

// DELETE Study Hour Log By Entry ID

app.delete(
  route + "/study-hour-logs/:entryId",
  [param("entryId").isInt().toInt()],
  handleValidationErrors,
  (req, res) => {
    const entryId = req.params.entryId;

    deleteStudyLog(db, entryId)
      .then(() => {
        res.status(204).end(); // Successfully deleted
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          error: "An error occurred while deleting the study hour log.",
        });
      });
  }
);

/* Get User Information 

function getUserByEmail(email) {
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

/* Get All Users Query 

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

/* Get User Role 
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

/* Get Skill Categories 
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

/* Get Student Skill Mastery Data 

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

/* Get Student Information 
function getStudentInfo(userId) {
  console.log("id:" + userId);
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

/* Get Student Study Hours 
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

/* Get Student Bad Behaviors 
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

/* Get Behavior Categories 

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

/* Get Behavior Consequences For Given Behavior 

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

/* Add a Behavior to a Specific Student 
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

/* Add a Mastery Event to a Specific Student 
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

/* Add Study Hours for a Specific Student 
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

/* Sub Query For Updating Student Study Hours Completed

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

/* Sub Query For Updating Student Study Hours Required

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

/* Rollback Functions for when one transaction passes but another fails. 

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

*/

// Middleware for validation errors

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error(JSON.stringify(errors.array()));
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

/* App Start */

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
