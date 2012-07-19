var xmlrpc = require('xmlrpc'),
    URL = require('url');

exports.worker = function(task, input, cb) {
   
   var url = URL.parse(input.url);
   var client = xmlrpc.createClient({ host: url.host, port: url.port || 80, path: url.path})
   client.methodCall(input.xmlrpcMethod, input.xmlrpcParams, function(err, value) {
      if(err) { cb(err); return; }
      cb(null, {results: value});
   });
   
};

