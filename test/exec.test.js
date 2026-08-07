var test = require("node:test");
var assert = require("node:assert/strict");
var { pingHost } = require("../src/exec");

test("pingHost rejects shell metacharacters in host", function () {
  return assert.rejects(
    function () {
      return pingHost("127.0.0.1; id");
    },
    /Invalid host/
  );
});

test("pingHost rejects command substitution", function () {
  return assert.rejects(
    function () {
      return pingHost("$(whoami)");
    },
    /Invalid host/
  );
});
