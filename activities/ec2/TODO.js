
/*

# Ouvrir une session SSH :
ssh -i ~/.ec2/quickflow.pem bitnami@ec2-23-20-110-171.compute-1.amazonaws.com


# Pour lancer une commande :
ssh -i ~/.ec2/quickflow.pem bitnami@ec2-23-20-110-171.compute-1.amazonaws.com 'uptime'



# USER DATA :

GET http://169.254.169.254/2007-03-01/user-data

*/

// TODO: make default duration of the task much longer !


exports.worker = function(task, input, cb) {
   
   var ec2 = aws.createEC2Client(yourAccessKeyId, yourSecretAccessKey);
   
   function pollCheckRunning(instanceId, interval) {
      
      ec2.call("DescribeInstances", {}, function(err, result) {
         
         if(err) { cb(err); return; }
         
         var allInstances = [];
         
         // XML to JSON conversion is bad on arrays
         var reservationSets = result.reservationSet.item;      
         if( !Array.isArray(reservationSets) ) reservationSets = [reservationSets];
         
         reservationSets.forEach(function(r) {
            var instances = r.instancesSet.item;
            if( !Array.isArray(instances) ) r.instancesSet.item = [r.instancesSet.item];
            allInstances = allInstances.concat(instances);
         });
         
         var instances = allInstances.filter(function(i){return i.instanceId==instanceId;})
         if(instances.length != 1) {
            console.log("bouhh...");
         }
         
         var instance = instances[0];
         
         console.log(instance.instanceState.name);
         
         if(instance.instanceState.name == "running") {
            console.log("EC2 instance running !");
            
            clearInterval(interval);
            
            cb(null, {instanceId: instanceId, instance: instance});
            
         }
      });
      
   };
   
   var instanceId, 
       reservationId;
   ec2.call("RunInstances", {
     ImageId: input.ImageId,
     MinCount: 1,
     MaxCount: 1,
     
     UserData: "This is some cool user data\nOuyeah\n",
     InstanceType: "m1.small",
     
     KeyName: "quickflow",
     
     "SecurityGroup.0": "quick-start-1"
     
     
   }, function (err, response) {
      
     if(err) { cb(err); return; }
     
     console.log("Instance created !");
     console.log( response );
     
     reservationId   = response.reservationId;
     instanceId      = response.instancesSet.item.instanceId;
     
    var interval = setInterval(function() {
          pollCheckRunning(instanceId, interval);
       }, 5000);
       
   });
   
};
    