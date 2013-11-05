/*
 * Monitors route
 */

var monitorModel = require('../models/monitors/monitors.js');

exports.add = function(req, res){

    var user_id = 1234;
    var params = req.body;

    monitorModel.add(user_id, params.name, params.email, params.interval, params.description, params.definition,function(err,result){
        if(err){

            //callback(err,null);
            res.send('error');
        }else{

            //callback(null,result);
            res.send('success');

        }
    });
  //res.send("respond with a resource");
};

exports.list = function(req, res){

    var user_id = 1234;

    monitorModel.list(user_id, function(err,result){
        if(err){
            res.send('error');
        }else{

            //callback(null,result);
            res.send(result);

        }
    });
};

exports.delete = function(req, res){

    var user_id = 1234;
    var monitor_id = req.params.id;

    monitorModel.delete(user_id, monitor_id, function(err,result){
        if(err){
            res.send('error');
        }else{

            //callback(null,result);
            res.send(result);

        }
    });

};