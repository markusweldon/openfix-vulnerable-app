var test = require("node:test");
var assert = require("node:assert/strict");
var { findUserByName } = require("../src/db/query");

test("findUserByName returns parameterized query", function () {
  var result = findUserByName("ada");
  assert.equal(result.sql, "SELECT * FROM users WHERE name = ?");
  assert.deepEqual(result.params, ["ada"]);
});

test("findUserByName keeps user input out of SQL string", function () {
  var malicious = "' OR '1'='1";
  var result = findUserByName(malicious);
  assert.doesNotMatch(result.sql, /OR '1'='1/);
  assert.equal(result.params[0], malicious);
});
