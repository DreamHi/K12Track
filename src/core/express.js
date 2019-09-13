const helmet         = require("helmet");
const compression    = require("compression");
const bodyParser     = require("body-parser");
const methodOverride = require("method-override");
const morgan         = require("morgan");
const responseTime   = require("response-time");
const i18n           = require("i18n");
const cors           = require("cors");
const log4js         = require("log4js");
const log            = require("./logger");

module.exports = (app) => {
  app.use(helmet());
  app.use(compression());
  app.use(responseTime());

  app.use(log4js.connectLogger(log.access, { level: "auto" }));

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));
  // parse application/json
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(morgan("dev"));
  app.use(cors());

  i18n.configure({
    locales:["en", "ja", "zh"],
    defaultLocale: "zh",
    directory: `${process.cwd()}/locales`,
  });
  i18n.setLocale("zh");

  global.__ = i18n.__;
  app.use(i18n.init);

  // override with the X-HTTP-Method-Override header in the request
  app.use(methodOverride("X-HTTP-Method"));          // Microsoft
  app.use(methodOverride("X-HTTP-Method-Override")); // Google/GData
  app.use(methodOverride("X-Method-Override"));      // IBM
};
