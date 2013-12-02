/* 
 * db connection specifics.
 * 
 * Every model class has to use this connection to the db.
 */

var mysql = require('mysql');

// Using pooled connections
// https://github.com/felixge/node-mysql
var pool = mysql.createPool({
  host     : process.env.MYSQL_HOST,
  user     : process.env.MYSQL_USER,
  database : process.env.MYSQL_DATABASE,
  password : process.env.MYSQL_PASSWORD,
  connectionLimit : 25,
  waitForConnections: true,
  queueLimit: 0
});

pool.getConnection(function(err) {
  if (err) throw err;
});

exports.getPoolConnection = function(){
    return pool;
};

exports.timeNow = function(){
    var now = new Date();
    
    var month = now.getMonth() + 1; // month is a 0 based index
    
    var mysql_now = now.getFullYear() + '-' + month + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + '.' + now.getMilliseconds();
    //console.log(mysql_now);
    return mysql_now;
}