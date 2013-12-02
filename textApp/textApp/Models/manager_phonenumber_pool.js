/*
 manager_phonenumber_pool

 A pool of numbers used to send text messages to the location managers.

 */

var db = require('./db.js');
var pool = db.getPoolConnection();

var tablename = 'manager_phonenumber_pool';

/**
 * Get an available manager's pool id to use.  Will not return one that is passed in
 * in the usedIdArray.
 *
 * @params {array}
 * @returns {int}
 */
exports.getAvailable = function(usedIdArray, callback){

    pool.getConnection(function(err, connection) {

        // Build query
        var notString = 'WHERE id != 0 ';
        for(var i=0; i < usedIdArray.length; i++){
            notString = notString + ' AND id !='+usedIdArray[i] + ' ';
        }

        var q = 'SELECT * FROM '+tablename+' ' + notString;
        console.log(q);

        connection.query(q, function(err, result) {

            if (err){
                //throw err;
                console.log('Error: sms_records', err);
            }

            try{
                if(result.length==0){
                    // This should be an error if it reaches this

                    var temp = 0;

                    callback(null, temp);
                }else{
                    // Found  record, return the first one

                    var temp = result[0].id;

                    callback(null, temp);
                }

            }catch(e){
                console.log("Error: MySQL mem leak" + e);
                //console.log(e);
            }finally{
                // And done with the connection.
                connection.release();
            }
        });
    });
}

/**
 * Return a phone number with the given id
 *
 * This will have to be changed to query the DB.
 *
 * @param {int} id
 * @returns {int} phoneNumber
 */
exports.getById = function(id){

    console.log('manager_phonenumber_pool.getById: ' + id);

    switch(id){
        case 1:
            return '14159121541';
            break;
        case 2:
            return '14156826524';
            break;
        default:
            return null;
    }
}

exports.getById2 = function(id, callback){

    pool.getConnection(function(err, connection) {

        var q = 'SELECT * FROM '+tablename+' WHERE id='+manager_phonenumbers_id;
        console.log(q);

        connection.query(q, function(err, result) {

            if (err){
                //throw err;
                console.log('Error: sms_records', err);
            }

            try{
                if(result.length==0){
                    // This should be an error if it reaches this

                    var temp = 0;

                    callback(null, temp);
                }else{
                    // Found  record

                    var temp = result[0].phone_number;

                    callback(null, temp);
                }

            }catch(e){
                console.log("Error: MySQL mem leak" + e);
                //console.log(e);
            }finally{
                // And done with the connection.
                connection.release();
            }
        });
    });
}