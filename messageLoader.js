const fs = require("fs");
const path = require("path");
const logFilePath = path.join(__dirname, "logs.json");

function getLogs() {
  if (!fs.existsSync(logFilePath)) {
    return [];
  }

  const data = fs.readFileSync(logFilePath, "utf8");
  if (!data) {
    return [];
  }

  return JSON.parse(data);
}

function saveLogs(user, bot) {
  const logs = getLogs();
  logs.push({ user, bot });
  fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2));
}

function clearLogs() {
  fs.writeFileSync(logFilePath, "[]");
}

module.exports = { getLogs, saveLogs, clearLogs };
