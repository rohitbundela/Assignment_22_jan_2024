const Sequelize = require("sequelize");

function createSqlConnection() {
  const db = new Sequelize("contactGla", "root", "Yash@1234", {
    host: "127.0.0.1",
    dialect: "mariadb",
  });

  db.authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch((error) => {
      console.error("Unable to connect to the database: ", error);
    });

  return db; // Add this line to return the Sequelize object
}

const sequelize = createSqlConnection();

module.exports = sequelize;