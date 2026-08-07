/**
 * Safe arithmetic evaluator for user-supplied expressions.
 * Only digits, whitespace, parentheses, and + - * / . are allowed.
 */

function calculate(expr) {
  if (typeof expr !== "string") {
    throw new Error("Expression must be a string");
  }

  var sanitized = expr.trim();
  if (!sanitized || !/^[\d+\-*/().\s]+$/.test(sanitized)) {
    throw new Error("Invalid expression");
  }

  return evaluateExpression(sanitized);
}

function evaluateExpression(expr) {
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
    while (index < expr.length && /[\d.]/.test(expr[index])) {
      index++;
    }
    if (start === index || (expr[start] === "-" && index === start + 1)) {
      throw new Error("Invalid expression");
    }
    var value = parseFloat(expr.slice(start, index));
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
    return parseNumber();
  }

  function parseTerm() {
    var value = parseFactor();
    skipWhitespace();
    while (index < expr.length && (expr[index] === "*" || expr[index] === "/")) {
      var op = expr[index++];
      var right = parseFactor();
      if (op === "*") {
        value *= right;
      } else {
        if (right === 0) {
          throw new Error("Division by zero");
        }
        value /= right;
      }
      skipWhitespace();
    }
    return value;
  }

  function parseExpression() {
    var value = parseTerm();
    skipWhitespace();
    while (index < expr.length && (expr[index] === "+" || expr[index] === "-")) {
      var op = expr[index++];
      var right = parseTerm();
      value = op === "+" ? value + right : value - right;
      skipWhitespace();
    }
    return value;
  }

  var result = parseExpression();
  skipWhitespace();
  if (index !== expr.length) {
    throw new Error("Invalid expression");
  }
  return result;
}

module.exports = { calculate };
