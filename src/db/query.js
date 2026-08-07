/**
 * Parameterized query — user input bound via placeholders, not concatenation.
 */
function findUserByName(name) {
  return {
    sql: "SELECT * FROM users WHERE name = ?",
    params: [name],
  };
}

module.exports = { findUserByName };
