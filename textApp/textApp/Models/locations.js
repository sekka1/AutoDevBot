/**
 * returns the location ID of a location's phone number
 *
 * @param {int} phoneNumber
 * @returns {number}
 */
exports.getLocationId = function(phoneNumber){

    // Not sure why there has to be a space in front of the number. But it works.
    if(phoneNumber == ' 19498912906')
        return 1;
    if(phoneNumber == ' 19496122499')
        return 2;
}