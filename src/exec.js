var { execFile } = require("child_process");

var HOST_PATTERN = /^[a-zA-Z0-9.-]+$/;

function pingHost(host) {
  if (typeof host !== "string" || host.length === 0 || host.length > 253) {
    return Promise.reject(new Error("Invalid host"));
  }
  if (!HOST_PATTERN.test(host)) {
    return Promise.reject(new Error("Invalid host"));
  }

  return new Promise(function (resolve, reject) {
    execFile("ping", ["-c", "1", host], function (err, stdout, stderr) {
      if (err) return reject(err);
      resolve(stdout || stderr);
    });
  });
}

module.exports = { pingHost };
