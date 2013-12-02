/**
 * Returns an array of the managers information given an location_id
 *
 * @param {int} location_id
 * @returns {array}
 */
exports.getByLocationId = function(location_id){

    var results = new Array();

    switch(location_id){
        case 1:
            results['id'] = 1;
            results['name'] = 'Garland';
            results['phone_number'] = '14153776633';
            break;
        case 2:
            results['id'] = 1;
            results['name'] = 'Garland';
            results['phone_number'] = '14153776633';
    }

    return results;
}