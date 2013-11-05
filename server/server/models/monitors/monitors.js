/*
 * Monitors Model
 *
 */

var db = require('./../db.js');
var pool = db.getPoolConnection();

var tableName = 'monitor_definitions';

exports.add = function(user_id, name, email, interval, description, definition, callback){

    pool.getConnection(function(err, connection) {
        connection.query('INSERT INTO '+tableName+' SET ?', {
            user_id: user_id,
            name: name,
            email: email,
            interval: interval,
            description: description,
            definition: definition,
            datetime_modified: db.timeNow(),
            datetime_created: db.timeNow()}, function(err, result) {

            if (err){
                //throw err;
                console.log('Error: Models/monitors', err);
            }

            //console.log('row id: ' + result.insertId);

            //var result = 'success';

            try{
                callback(null, result);
            }catch(e){
                console.log("Error: MySQL mem leak" + e);
                callback(e, null);
            }finally{
                // And done with the connection.
                connection.release();
            }


        });
    });
}

exports.list = function(user_id, callback){

    pool.getConnection(function(err, connection) {
        connection.query('select * from '+tableName+' where user_id = '+user_id, function(err, result) {

            if (err){
                //throw err;
                console.log('Error: Models/monitors', err);
            }

            //console.log('row id: ' + result.insertId);

            //var result = 'success';

            try{
                callback(null, result);
            }catch(e){
                console.log("Error: MySQL mem leak" + e);
                callback(e, null);
            }finally{
                // And done with the connection.
                connection.release();
            }


        });
    });
}

exports.delete = function(user_id, monitor_id, callback){

    pool.getConnection(function(err, connection) {
        connection.query('delete from '+tableName+' where user_id = '+user_id+' and id = '+monitor_id, function(err, result) {

            if (err){
                //throw err;
                console.log('Error: Models/monitors', err);
            }

            //console.log('row id: ' + result.insertId);

            //var result = 'success';

            try{
                callback(null, result);
            }catch(e){
                console.log("Error: MySQL mem leak" + e);
                callback(e, null);
            }finally{
                // And done with the connection.
                connection.release();
            }


        });
    });
}