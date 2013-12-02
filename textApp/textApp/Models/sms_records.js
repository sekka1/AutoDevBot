/*

 */

var db = require('./db.js');
var pool = db.getPoolConnection();

exports.readFromCustomer = function(location_id, customers_phonenumber, callback){

    pool.getConnection(function(err, connection) {

        var q = 'SELECT * FROM sms_records WHERE locations_id='+location_id+' AND customers_phone_number = "'+customers_phonenumber+'" AND datetime_created > DATE_SUB(NOW(), INTERVAL 2 HOUR) limit 1';
        console.log(q);

        connection.query(q, function(err, result) {

            if (err){
                //throw err;
                console.log('Error: sms_records', err);
            }

            console.log(result);
            console.log(result.length);


            try{
                if(result.length==0){
                    // No previous records found

                    var temp = new Array();
                    temp['hasRecord'] = false;

                    callback(null, temp);
                }else{
                    // Found previous record

                    var temp = new Array();
                    temp['hasRecord'] = true;
                    temp['locations_id'] = result[0].locations_id;
                    temp['customers_phone_number'] = result[0].customers_phone_number;
                    temp['manager_phonenumbers_id'] = result[0].manager_phonenumbers_id;
                    temp['manager_phonenumber_pool_id'] = result[0].manager_phonenumber_pool_id;
                    temp['message_from'] = result[0].message_from;
                    temp['message'] = result[0].message;
                    temp['datetime_created'] = result[0].datetime_created;
                    temp['datetime_modified'] = result[0].datetime_modified;

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
};

exports.save = function(messageSid, location_id, customers_phone_number, manager_phonenumbers_id, manager_phonenumber_pool_id, message_from, message, callback){

    pool.getConnection(function(err, connection) {
        connection.query('INSERT INTO sms_records (messageSid, locations_id, customers_phone_number, manager_phonenumbers_id, manager_phonenumber_pool_id, message_from, message, datetime_created, datetime_modified) VALUE("'+messageSid+'", '+location_id+', "'+customers_phone_number+'", '+manager_phonenumbers_id+', '+manager_phonenumber_pool_id+', "'+message_from+'", "'+message+'", now(), now())', function(err, result) {

            if (err){
                //throw err;
                console.log('Error: sms_records', err);
            }

            console.log(result);
            //console.log(result.length);


            try{
                callback(null, result);

            }catch(e){
                console.log("Error: MySQL mem leak" + e);
                //console.log(e);
            }finally{
                // And done with the connection.
                connection.release();
            }
        });
    });
};

/**
 * Returns a list of used manager_phonenumber_pool_id(s) that this manager
 * has used in the last 2 hours.
 *
 * @param {int} manager_phonenumbers_id
 */
exports.getUsedManagerPhonenumberPoolId = function(manager_phonenumbers_id, callback){

    pool.getConnection(function(err, connection) {

        var q = 'select distinct manager_phonenumber_pool_id from sms_records where manager_phonenumbers_id='+manager_phonenumbers_id+' AND datetime_created > DATE_SUB(NOW(), INTERVAL 2 HOUR)';
        console.log(q);

        connection.query(q, function(err, result) {

            if (err){
                //throw err;
                console.log('Error: sms_records', err);
            }

            console.log('getUsedManagerPhonenumberPoolId: ');
            console.log(result);
            console.log(result.length);

            try{
                if(result.length==0){
                    // No previous records found

                    var temp = new Array();
                    temp.push(0);

                    callback(null, temp);
                }else{
                    // Found previous record

                    var temp = new Array();

                    for(var i=0; i < result.length; i++){
                        temp.push(result[i].manager_phonenumber_pool_id);
                    }

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