/*
Manager module

 */

var sms_records = require('./../Models/sms_records.js');
var twilio = require('./Twilio.js');
var locations = require('./../Models/locations.js');
var manager_phonenumbers = require('./../Models/manager_phonenumbers.js');
var manager_phonenumber_pool = require('./../Models/manager_phonenumber_pool.js');

// internal vars
var messageSID = ''; // Twilio message SID
var location_id = 0;
var locationsPhoneNumber = ''; // The destination/store's number
var customersPhoneNumber = ''; // Customer's phone number
var textMessage = ''; // Text message from the customer
var managers_phonenumber_array;
var manager_pool_id = 0;
var fromDircection = 'none';

/**
 *
 * @param {string} sid
 */
exports.setMessageSID = function(sid){
    messageSID = sid;
}
/**
 *
 * @param {string} phoneNumber
 */
exports.setLocationsPhoneNumber = function(phoneNumber){
    locationsPhoneNumber = phoneNumber;
}
/**
 *
 * @param {string} phoneNumber
 */
exports.setCustomersPhoneNumber = function(phoneNumber){
    customersPhoneNumber = phoneNumber;
}
/**
 *
 * @param {string} message
 */
exports.setTextMessage = function(message){
    textMessage = message;
}
/**
 * Send message to the manager.
 *
 * Looks up if there was a message from this customer in the last hour.  If so, it will use
 * those settings to send to the manager.  If not, it will generate new params and use that to
 * send to the manager.
 *
 * @param {function} callback
 */
exports.sendToManager = function(callback){
    console.log('Sending message to the manager');

    // Get location id
    location_id = locations.getLocationId(locationsPhoneNumber);

    // Get record from DB.  Check if there is a record of this transaction from the DB already
    sms_records.readFromCustomer(location_id, customersPhoneNumber, function(err, results){

        if(err){
            callback(err, null);
        }else{
            // Use the results and continue

            // Setting direction this message is coming from
            fromDircection = 'customer';

            if(results.hasRecord){
                console.log("Found previous record from customer.  Using those settings.");
                console.log("location id: " + results.locations_id);

                // Get manager of this locations information
                managers_phonenumber_array = manager_phonenumbers.getByLocationId(results.locations_id);

                // Get a pool number to use to send from
                manager_pool_id = results.manager_phonenumber_pool_id;

                // Send message
                sendMessage();
            }else{
                console.log("Did not find previous record from customer");

                // Get manager of this locations information
                managers_phonenumber_array = manager_phonenumbers.getByLocationId(location_id);

                // Get a pool number to use to send from
                //manager_pool_id = manager_phonenumber_pool.getAvailable();
                getAvailableManagerPoolId();

                // Send message
                //sendMessage();
            }

        }
    });

};

/**
 * Send the message from the customer to the location manager using Twilio
 *
 */
sendMessage = function(){

    // Send message
    var fromNumber = manager_phonenumber_pool.getById(manager_pool_id);

    console.log('location managers phone number: '+managers_phonenumber_array['phone_number']);
    console.log('fromNumber: '+fromNumber);
    console.log('textMessage: '+textMessage);

    twilio.sendSMS(managers_phonenumber_array['phone_number'], fromNumber, textMessage, function(err, result){

        if(err){
            console.log('there was some error');
            //callback(true, null);
        }else{
            console.log('message sent to manager');
            // Record message in DB

            sms_records.save(messageSID, location_id, customersPhoneNumber, managers_phonenumber_array['id'], manager_pool_id, fromDircection, textMessage, function(err){
                if(err){
                    callback(err, null);
                }else{
                    console.log('saved sms_record');
                }
            });


        }
    });
};

/**
 * Finds a manager's pool outbound phone number to use to send to the
 * location's manager with.  It tries to find a number that it has not recently
 * used so that conversations are in one phone number's sms thread on the
 * user's phone.
 *
 * @returns {int} manager pool id
 */
getAvailableManagerPoolId = function(){

    // Get a list of manager_phonenumber_pool_id used by this manager_phonenumbers_id
        // in the last hour
        // this is a list of pooled number this manager has used


    // Get a list of all available pooled numbers that are not in that list

    sms_records.getUsedManagerPhonenumberPoolId(managers_phonenumber_array['id'], function(err, result){
        if(err){
            //callback(err, null);
            console.log('err in manager.getAvailableManagerPoolId()');
        }else{
            console.log('getAvailableManagerPoolId results');
            console.log(result);

            // Get next available manager pooled number to use
            manager_phonenumber_pool.getAvailable(result, function(err, pool_id){
                if(err){
                    console.log('error in manager.getUsedManagerPhonenumberPoolId.manager_phonenumber_pool');
                }else{
                    console.log('pool_id selected: ' + pool_id);

                    // Set the pool id
                    manager_pool_id = pool_id;

                    // Send message
                    // This is here now b/c we need to finish all the SQL operations before trying to use
                    // any of those variable for sending the message.
                    sendMessage();
                }
            });

        }
    });

}