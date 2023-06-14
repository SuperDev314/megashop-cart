const mysql = require("mysql");
const config = {
  host: "205.209.103.51",
  user: "myvaluboxcom_myvaluboxcom",
  password: "mvb@3102^&*",
  database: "myvaluboxcom_cart_data",
};
const connection = mysql.createConnection(config);
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database: " + err.stack);
    return;
  }
  console.log("Connected to database as id " + connection.threadId);
});
module.exports = connection;
