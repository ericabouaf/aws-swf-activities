var sf = require('node-salesforce');

exports.worker = function(task, input, cb) {
   
   var conn = new sf.Connection({
      loginUrl: input.loginUrl || 'https://login.salesforce.com'
   });
   
   conn.login( input.username, input.password, function(err) {
      
      if(err) { cb(err); return; }
      
      console.log("SALESFORCE QUERY: Logged In !");
      
      var records = [];
      conn.query( input.query, cb);
      
   });
   
};