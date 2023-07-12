const path = require('path');

module.exports = function (results) {
  let summary = { issues: [] };
  results.forEach(function (result) {
    result.messages.forEach(function (msg) {
      let logMessage = {
        engineId: 'eslint',
        ruleId: msg.ruleId,
        primaryLocation: {
          message: msg.message,
          filePath: path.relative(process.cwd(), result.filePath),
          textRange: {
            startLine: msg.line,
            startColumn: msg.column,
            endLine: msg.endLine,
            endColumn: msg.line == msg.endLine && msg.column + 1 == msg.endColumn ? msg.endColumn : msg.endColumn - 1,
          },
        },
      };
      if (msg.severity === 1) {
        logMessage.type = 'CODE_SMELL';
        logMessage.severity = 'INFO';
      }
      if (msg.severity === 2) {
        logMessage.type = 'BUG';
        logMessage.severity = 'MAJOR';
      }
      summary.issues.push(logMessage);
    });
  });
  return JSON.stringify(summary);
};
