require("dotenv").config();

const MONGO_DB_CONNECTION = process.env.MONGO_DB_CONNECTION;

module.exports = {
  MONGO_DB_CONNECTION,
};
