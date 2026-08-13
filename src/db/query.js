/**
 * Parameterized SQL query for user lookup.
 * User input is bound as a parameter, not concatenated into the SQL string.
 */
function findUserByName(name) {
  return {
    sql: "SELECT * FROM users WHERE name = ?",
    params: [name]
  };
}

module.exports = { findUserByName };
