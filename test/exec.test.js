var test = require("node:test");
var assert = require("node:assert/strict");
var { pingHost } = require("../src/exec");

test("pingHost rejects shell metacharacters in host", function () {
  return pingHost("127.0.0.1; id").then(
    function () {
      assert.fail("expected rejection");
    },
    function (err) {
      assert.match(String(err.message || err), /Invalid host/);
    }
  );
});

test("pingHost pings a valid localhost address", function () {
  return pingHost("127.0.0.1").then(function (out) {
    assert.match(out, /127\.0\.0\.1|1 packets transmitted|1 received/);
  });
});
