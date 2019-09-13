module.exports = {
  name: "k12track",
  alias: "k12track",
  port: process.env.PORT || 3000,
  tokenHeader: "x-token-k12track",
  tokenSecret: process.env.TOKEN || "k12track",
  tokenLength: 32,
  tokenExpires: 24 * 60 * 60 * 1000, // 24h
};
