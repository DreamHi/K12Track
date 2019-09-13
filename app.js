const express      = require("express");
const config       = require("./config/app");
const log          = require("./src/core/logger");

const app          = express();
const { port }     = config;

// 1. 服务器设置
app.set("view cache", false);
app.disable("etag");
app.set("trust proxy", 1); // trust first proxy
log.warn("init server");

// 2. DB 设置
log.warn("init db");

// 3. Express 中间件设置
log.warn("init express");
require("./src/core/express")(app);

// 4. route 设置
log.warn("init routes");
require("./src/routes/index")(app);

// 5. 启动服务
app.listen(port, () => log.warn(`Server listening on port ${port}`));
