
var http = require('http'),
    https = require('https'),
    querystring = require('querystring'),
    URL = require('url'),
    xml2js = require('xml2js-expat');


exports.worker = function(task) {
   
   var input = JSON.stringify(task.config.input)
   
   var url = URL.parse(input["url"]);
   var method = input.method || "GET";

   var port = url.port;
   if(!port) { port = 80; }
   
   var encoding = input.encoding || "application/x-www-form-urlencoded";
   
   var ssl = false;
   if( input["url"].substr(0,5) == "https" ) {
      ssl = true;
      port = 443;
   }
   
   //console.log( url );
   
   //var client = http.createClient(port, url.hostname, ssl);
   
   var path = url.pathname || '/';
   
   if(method == "GET" || method == "DELETE") {
      path += '?'+querystring.stringify(input.data);
   }
   
   var headers = {
      'host': url.hostname, 
      'accept': '*/*'
   };
   
   var body;
   if(method == "POST") {
      if(encoding == "application/x-www-form-urlencoded") {
         body = querystring.stringify(input.data);
      }   
      else if (encoding == "application/json") {
         body = JSON.stringify(input.data);
      }
      headers["content-length"] = body.length;
      headers["content-type"] = encoding;
   }
   
   var options = {
       port: port,
       host: url.hostname,
       method: method,
       path: path,
       headers: headers
   };
   
   if(url.auth) {
      options.auth = url.auth;
   }
   
   console.log(options);
   
   
   var request = (ssl ? https : http).request(options);
   
   if(method == "POST" || method == "PUT") {
      request.write(body);
   }
   
   request.end();
   
   request.on('response', function (response) {
     
     /*console.log("Got response !");
     
     console.log('STATUS: ' + response.statusCode);
     console.log('HEADERS: ' + JSON.stringify(response.headers) );*/
     
     response.setEncoding('utf8');
     var complete = "";
     response.on('data', function (chunk) {
          complete += chunk;
     });
     response.on('end', function () {
      
         r = complete;
         
         // content-type:
         var contentType = response.headers["content-type"].split(';')[0];
         
         if(contentType) {
            
            //console.log("Content-Type "+contentType);
            
            if( contentType == "application/json" ||
                contentType == "text/javascript" ||
                contentType == "application/javascript") {
               r = JSON.parse(complete);
            }
         
            if(contentType == "text/xml") {
               
               var parser = new xml2js.Parser();
               parser.addListener('end', function(result) {
                   
                   task.respondCompleted({out: result }, function(err) { // TODO: wrong output
                      if(err) { console.error(err); return; }
                      console.log("echo: respondComplete");
                   });
                   
               });
                parser.parseString(complete);
               return;
               
            }
            
         }
               
         task.respondCompleted({headers: response.headers, body: r}, function(err) {
             if(err) { console.error(err); return; }
             console.log("echo: respondComplete");
          });
         
     });
   
   });

};
