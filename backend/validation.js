/**
 * Ensures the userId is valid
 * @param {any} userId
 * @returns true if valid userId, false otherwise
 */
function validateUser(userId) {
  /*TODO: Ensure id exists */
  return Number.isInteger(userId);
}

/**
 * Ensures the behaviorId is valid
 * @param {any} behaviorId
 * @returns true if valid behaviorId, false otherwise
 */
function validateBehavior(behaviorId) {
  /*TODO: Ensure id exists */
  return Number.isInteger(behaviorId);
}

/**
 * Ensures the skillId is valid
 * @param {any} skillId
 * @returns true if valid skillId, false otherwise
 */
function validateSkill(skillId) {
  /*TODO: Ensure id exists */
  return Number.isInteger(skillId);
}

/**
 * Ensures a masteryStatus value is valid
 * @param {any} masteryStatus
 * @returns true if valid materyStatus, false otherwise
 */
function validateMasteryStatus(masteryStatus) {
  return masteryStatus > 0 && masteryStatus <= 5;
}

/**
 * Ensures  is valid
 * @param {any} userId
 * @returns true if valid userId, false otherwise
 */
function validateDateOfEvent(dateOfEvent) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  return dateRegex.test(dateOfEvent);
}

/**
 * Ensures a dateTime is valid
 * @param {any} dateTime
 * @returns true if valid dateTime, false otherwise
 */
function validateDatetime(dateTime) {
  const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

  return dateTimeRegex.test(dateTime);
}

/**
 * Ensures an email is valid
 * @param {any} email
 * @returns true if valid email, false otherwise
 */
function validateEmail(email) {
  const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

  return regex.test(email);
}

module.exports = {
  validateUser,
  validateBehavior,
  validateSkill,
  validateMasteryStatus,
  validateDateOfEvent,
  validateDatetime,
  validateEmail,
};
