# AWS-SWF activities

This repository contains a collection of activities in Node.js for the [AWS-SWF](https://github.com/neyric/aws-swf) toolkit.

````sh
$ cd activities
$ swf-activity --accessKeyId "... your accessKeyId ..." --secretAccessKey "... your secret key id..."
````

Check the [swf-activity user guide](https://github.com/neyric/aws-swf#swf-activity) to configure the domain, tasklist or poller identity.

Most of the activities expect parameters to be passed in JSON format


## How to create an activity


### 1. Create the package.json

 * name of the activity type
 * main: worker module

+ add dependencies

### 2. create the worker module

````javascript
exports.worker = function(task, config) {
   
   var input_parameters = task.config.input; // or JSON.parse(task.config.input)
   
   var result = f(input_parameters); // might be asynchronous
   
   // Send the response to AWS SWF
   task.respondCompleted(result, function(err) {
      if(err) { console.error(err); return; }
      console.log("echo: respondComplete");
   });
   
};
````

### 3. Config files (optional)

Write config files into config.js.

They should contains private stuff: credentials, passwords, oauth token, etc...

The config file is automatically loaded by the swf-activity worker and passed to the worker function.


## TODO

 * System to build html documentation of the activities (to add in the gh-pages branch)
 
 * script to npm install recursively in all folders
 
 
