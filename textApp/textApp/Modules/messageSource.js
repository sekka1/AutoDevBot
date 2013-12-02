

/**
 * Determines the origin of the message.  It is either from a manager
 * or from a customer.
 *
 * Determining this by either the from or the to phone number.
 *
 * @param {string} fromPhonenumber
 * @param {string} toPhoneNumber
 * @returns {string}
 */
exports.getOrigin = function(fromPhonenumber, toPhoneNumber){

    var source = '';

    // From Manager
    switch(fromPhonenumber){
        case '14159121541':
        case '14156826524':
        default:
            source = 'manager'
    }

    // To location - aka from customer
    switch(toPhoneNumber){
        case '19498912906':
        default:
            source = 'customer'
    }

    return source;
}