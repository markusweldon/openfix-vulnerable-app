var test = require("node:test");
var assert = require("node:assert/strict");
var { encryptNote } = require("../src/util/weak-cipher");

test("encryptNote returns hex ciphertext with salt and iv", function () {
  var result = encryptNote("note");
  var parts = result.split(":");
  assert.equal(parts.length, 3);
  assert.match(parts[0], /^[0-9a-f]{32}$/);
  assert.match(parts[1], /^[0-9a-f]{32}$/);
  assert.match(parts[2], /^[0-9a-f]+$/);
});

test("encryptNote produces distinct output for same input", function () {
  var a = encryptNote("same");
  var b = encryptNote("same");
  assert.notEqual(a, b);
});
