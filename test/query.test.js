var test = require("node:test");
var assert = require("node:assert/strict");
var { findUserByName } = require("../src/db/query");

test("findUserByName uses a parameterized query", function () {
  var result = findUserByName("ada");
  assert.equal(result.sql, "SELECT * FROM users WHERE name = ?");
  assert.deepEqual(result.params, ["ada"]);
});

test("findUserByName keeps injection payload in params, not SQL text", function () {
  var malicious = "x' OR '1'='1";
  var result = findUserByName(malicious);
  assert.equal(result.sql, "SELECT * FROM users WHERE name = ?");
  assert.doesNotMatch(result.sql, /OR '1'='1/);
  assert.deepEqual(result.params, [malicious]);
});
