var soap = require('soap');


exports.worker = function(task, input, cb) {
   
   try {
   
      soap.createClient( input.wsdlURL, function(err, client) {
      
         if(err) { cb(err); return; }
         
         
         try {
            client[input.soapMethod](input.soapParams, cb);
         }
         catch(ex) {
            cb(ex);
         }
      });
   
   }
   catch(ex) {
      cb(ex);
   }
};

