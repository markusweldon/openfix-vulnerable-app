var test = require("node:test");
var assert = require("node:assert/strict");
var path = require("path");
var { listDir } = require("../src/listdir");

test("listDir lists a directory", async function () {
  var out = await listDir(path.join(__dirname, "..", "data"));
  assert.match(out, /readme\.txt/);
});

test("listDir passes user path as argv without shell interpretation", async function () {
  await assert.rejects(
    function () {
      return listDir("; echo OPENFIX_SHELL_INJECTION");
    },
    function (err) {
      return err && (err.code === 2 || /No such file|ENOENT/.test(String(err.message)));
    }
  );
});
