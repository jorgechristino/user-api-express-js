const knex = require("knex")({
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "jor194",
    database: "usersapi",
  },
});

module.exports = knex;
