/*
Twilio Module
 */

// Create the Twilio object
var twilio = require('twilio');
// Create a new REST API client to make authenticated requests against the
// twilio back end
var client = new twilio.RestClient('ACf61bf23fa4a37f6a7ce1e4c78c2f5166', 'b113a18b49dc90d623a0b001051d34bf');

/**
 *
 * @param {int} toPhoneNumber
 * @param {int} fromPhoneNumber
 * @param {string} message
 * @param {function} callback
 */
exports.sendSMS = function(toPhoneNumber, fromPhoneNumber, textMessage, callback){

    client.sms.messages.create({
        to:toPhoneNumber,
        from:fromPhoneNumber,
        body:textMessage,
    }, function(error, message) {
// The HTTP request to Twilio will run asynchronously. This callback
// function will be called when a response is received from Twilio
// The "error" variable will contain error information, if any.
// If the request was successful, this value will be "falsy"
        if (!error) {
// The second argument to the callback will contain the information
// sent back by Twilio for the request. In this case, it is the
// information about the text messsage you just sent:
            console.log('Success! The SID for this SMS message is:');
            console.log(message.sid);

            console.log('Message sent on:');
            console.log(message.dateCreated);

            callback(null, true);
        }
        else {
            console.log('Oops! There was an error.');
            console.log(error);
            console.log(message);
            callback(true, null);
        }
    });

};