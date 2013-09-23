
var request = require('request');

// TODO: URL of the foule server in config.js

exports.worker = function (task, config) {

   var input = JSON.parse(task.config.input);

   // HTTP request to create the task in foule server
   request({
   		url: "http://localhost:3000/activity", // TODO: config.foule_server.url,
   		method: 'POST',
   		json: {
			"taskToken": task.config.taskToken,
			"activity": {
				"taskToken": task.config.taskToken,
				"input": task.config.input
			}
		}
   }, function (err, response, body) {

      if(err) {
         console.log(err);
         task.respondFailed(err, "");
         return;
      }

      console.log("Task created !");

   });

};
