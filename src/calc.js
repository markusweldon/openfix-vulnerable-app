/**
 * Safely evaluate basic arithmetic expressions (no eval).
 */
function calculate(expr) {
  if (typeof expr !== "string" || expr.trim() === "") {
    throw new Error("Invalid expression");
  }
  if (!/^[\d+\-*/().\s]+$/.test(expr)) {
    throw new Error("Invalid expression");
  }

  var index = 0;

  function skipWhitespace() {
    while (index < expr.length && /\s/.test(expr[index])) {
      index++;
    }
  }

  function parseNumber() {
    skipWhitespace();
    var start = index;
    if (expr[index] === "-") {
      index++;
    }
    if (expr[index] === ".") {
      throw new Error("Invalid expression");
    }
    while (index < expr.length && /\d/.test(expr[index])) {
      index++;
    }
    if (expr[index] === ".") {
      index++;
      while (index < expr.length && /\d/.test(expr[index])) {
        index++;
      }
    }
    if (start === index || (expr[start] === "-" && start + 1 === index)) {
      throw new Error("Invalid expression");
    }
    var value = Number(expr.slice(start, index));
    if (Number.isNaN(value)) {
      throw new Error("Invalid expression");
    }
    return value;
  }

  function parseFactor() {
    skipWhitespace();
    if (expr[index] === "(") {
      index++;
      var value = parseExpression();
      skipWhitespace();
      if (expr[index] !== ")") {
        throw new Error("Invalid expression");
      }
      index++;
      return value;
    }
    if (expr[index] === "+") {
      index++;
      return parseFactor();
    }
    if (expr[index] === "-") {
      index++;
      return -parseFactor();
    }
    return parseNumber();
  }

  function parseTerm() {
    var value = parseFactor();
    while (true) {
      skipWhitespace();
      var op = expr[index];
      if (op !== "*" && op !== "/") {
        return value;
      }
      index++;
      var right = parseFactor();
      if (op === "*") {
        value *= right;
      } else {
        if (right === 0) {
          throw new Error("Division by zero");
        }
        value /= right;
      }
    }
  }

  function parseExpression() {
    var value = parseTerm();
    while (true) {
      skipWhitespace();
      var op = expr[index];
      if (op !== "+" && op !== "-") {
        return value;
      }
      index++;
      value = op === "+" ? value + parseTerm() : value - parseTerm();
    }
  }

  var result = parseExpression();
  skipWhitespace();
  if (index !== expr.length) {
    throw new Error("Invalid expression");
  }
  return result;
}

module.exports = { calculate };
