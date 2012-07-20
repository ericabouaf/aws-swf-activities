var nodemailer = require("nodemailer");

var conf = require('./config');

exports.worker = function(task) {
   
   var smtpTransport = nodemailer.createTransport(conf.transport.type, conf.transport.options);
   
   var mailOptions = JSON.parse(task.config.input);
   
   smtpTransport.sendMail(mailOptions, function(err, response){
      
      if(err) {
         task.respondFailed(err, "");
         return; 
      }
      
      console.log("nodemailer worker sent: " + response.message);
      
      smtpTransport.close();
            
      task.respondCompleted({message: response.message});
      
   });
   
};

