var request = require('request');

var notifo = require('./config');

// input = { to: to, msg: msg, label: label, title: label, uri: url}

exports.worker = function(task) {
   
   var input = JSON.parse(task.config.input);
   
   try {
      
      request({
         url: 'https://'+notifo.username+':'+notifo.key+'@api.notifo.com/v1/send_notification',
         method: 'POST',
         form: input 
      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
           task.respondCompleted(body);
        }
        else {
           task.respondFailed(error, body);
        }
      });
      
   }
   catch(ex) {
      task.respondFailed(ex, "");
   }
};

