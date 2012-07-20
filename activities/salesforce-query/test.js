
var worker = require('./salesforce-query').worker;

var task = {
   
   config: {
      input: "SELECT Id, Name FROM Account Limit 10"
   },
   
   respondCompleted: function(results) {
      console.log("Done !");
      console.log(results);
   }
   
};

worker(task);


