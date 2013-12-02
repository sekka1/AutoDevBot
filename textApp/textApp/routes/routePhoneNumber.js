
/*
 * Incoming customer text
 */

// Manager module
var manager = require('./../Modules/Manager.js');
var messageSource = require('./../Modules/messageSource.js');

exports.route = function(req, res){

    console.log("MessageSid:" + req.body.MessageSid);
    console.log("AccountSid: " + req.body.AccountSid);
    console.log("From: " + req.body.From);
    console.log("To: " + req.body.To);
    console.log("Body: " + req.body.Body);
    console.log("NumMedia: " + req.body.NumMedia);

    // Figure out the message origin.  Either from a customer or a manager
    var messageOrigin = messageSource.getOrigin(req.body.From, req.body.To);

    if(messageOrigin == 'customer'){
        console.log('Message from customer');

        // Reply to customer that we have received their message

        // Send message to the manager of this location

        // Setting incoming text variables for the manger to use
        manager.setMessageSID(req.body.MessageSid);
        manager.setLocationsPhoneNumber(req.body.To);
        manager.setCustomersPhoneNumber(req.body.From);
        manager.setTextMessage(req.body.Body);

        // Send message to the corresponding managers for this "To/Locations" phone number
        manager.sendToManager(function(err){
            if(err){
                console.log("there was an error");
            }
            else{
                console.log("sent text ok");
            }
        });

    }
    else if(messageOrigin == 'manager'){
        console.log('Message from manager');

    }else{
        console.log('Message origin not found.');
        // Throw some kind of error.  Couldnt find this number in
        // our system.
    }

};

/*
exports.inComing = function(req, res){

    console.log("MessageSid:" + req.body.MessageSid);
    console.log("AccountSid: " + req.body.AccountSid);
    console.log("From: " + req.body.From);
    console.log("To: " + req.body.To);
    console.log("Body: " + req.body.Body);
    console.log("NumMedia: " + req.body.NumMedia);

    // Setting incoming text variables for the manger to use
    manager.setStoresPhoneNumber(req.body.To);
    manager.setCustomersPhoneNumber(req.body.From);
    manager.setTextMessage(req.body.Body);

    // Send message to the corresponding managers for this "To" phone number
    manager.sendToManager(function(err){
        if(err){
            console.log("there was an error");
        }
        else{
            console.log("sent text ok");
        }
    });

    // Reply to the customer that we got their text
    res.set({
        'Content-Type': 'text/xml'
    })

    res.send('<?xml version="1.0" encoding="UTF-8"?><Response><Message><Body>Thank you for your comment.  A manager will get back to you shortly.</Body></Message></Response>');

    // Cannot send MMS via US numbers at this time with Twilio.  Only canadian numbers can do this.
    //res.send('<?xml version="1.0" encoding="UTF-8"?><Response><Message><Body>Store Location: 123 Easy St.</Body><Media>https://demo.twilio.com/owl.png</Media></Message></Response>');
    //res.send('<?xml version="1.0" encoding="UTF-8"?><Response><Message><Body>Store Location: 123 Easy St.</Body></Message></Response>');

};
    */