var { execFile } = require("child_process");

function listDir(userPath) {
  return new Promise(function (resolve, reject) {
    execFile("ls", ["-la", userPath], function (err, stdout, stderr) {
      if (err) return reject(err);
      resolve(stdout || stderr);
    });
  });
}

module.exports = { listDir };
