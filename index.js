const mysql = require('mysql');
const moment = require('moment');

let connection = mysql.createConnection({
  host     : process.env.MYSQL_HOST || 'localhost',
  user     : process.env.MYSQL_USER || 'root',
  password : process.env.MYSQL_PASSWORD || 'root',
});

let valve01 = 0;

connection.connect((err) => {
    if (err) {
        console.error('Error connecting mysql: ' + err.stack);
        return;
    }

    console.log('Connected to MySQL');

    connection.query("CREATE DATABASE iot", function (query_err, result) {
        if (!query_err)
        console.log("Database created");
      });

      connection.changeUser({database : 'iot'}, function(err) {
        if (err) throw err;
      });

      let sql = "CREATE TABLE iot (timestamp TIMESTAMP, entity VARCHAR(20), value DOUBLE)";
      connection.query(sql, function (err, result) {
        if (!err)
            console.log("Table created");
      });
});


generateData = () => {
  valve01 += Math.random();

  if(valve01 > 20) {
    valve01 = 0;
  }

    let timestamp =  moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

    let sql = "INSERT INTO iot (timestamp, entity, value) VALUES ('" + timestamp + "', 'valve01', " + valve01 + ")";
    connection.query(sql, function (err, result) {
      if (err) throw err;
    });
}

setInterval(generateData, 1000);
