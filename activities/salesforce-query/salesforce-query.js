
var sf = require('node-salesforce');

var conf = require('./config');

exports.worker = function(task) {
   
   // Login
   var conn = new sf.Connection({ loginUrl: conf.loginUrl });
   conn.login( conf.username, conf.password, function(err) {
      
      if(err) { 
         task.respondFailed(err, "");
         return; 
      }
      
      console.log("SALESFORCE QUERY: Logged In !");
      
      // Query
      conn.query( task.config.input, function(err, results) {
         
         task.respondCompleted(results);
         
      });
      
   });
   
};