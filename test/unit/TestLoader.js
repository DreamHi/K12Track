// eslint-disable-next-line node/no-unpublished-require
const Mocha = require("mocha");

const mocha = new Mocha({
  ui: "bdd",
  globals: ["okGlobalA", "okGlobalB", "okGlobalC", "callback*"],
  timeout: 120000,
  growl: true,
  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "test/reports/UnitMocha",
    reportName: "K12Track",
    reportTitle: "K12Track Mocha Report",
    inlineAssets: true,
  },
});

// mocha.addFile("test/unit/TestInit.js");

// core
mocha.addFile("test/unit/core/test_helper");
// controller system
// mocha.addFile("test/unit/modules/test_ctrl_user");
// mocha.addFile("test/unit/modules/system/test_ctrl_group");
// mocha.addFile("test/unit/modules/system/test_ctrl_token");


mocha.run(() => {
  console.log("done");
  process.exit(0);
}).on("pass", (test) => {
  console.log("... %s", test.title);
});
