const spawn = require("child_process").spawn;
const schedule = require("node-schedule");

schedule.scheduleJob("*/30 * * * *", () => {
  console.log("Launching standings scraper.\n");
  spawn("node", ["index.js"]);
});
