
// Create a server
schedule({
   name: 'step1',
   activity: 'ec2_runInstances',
   input: {
      ImageId: "ami-de46b4b7",
      MinCount: 1,
      MaxCount: 1,
      UserData: "This is some cool user data\nOuyeah\n",
      InstanceType: "m1.small",
      KeyName: "quickflow",
      Monitoring: {
         Enabled: false
      }
   }
});

// Use a SWF Timer
if( completed('step1') && !timer_scheduled('step2') ) {
   start_timer({
      name: 'step2',
      delay: 60
   });
}



// Close the server
if( completed('step2') && !scheduled('step3') ) {
   schedule({
      name: 'step3',
      activity: 'ec2_terminateInstances',
      input: function() {
         var instanceId = results('step1').instancesSet.item.instanceId;
         return { InstanceIds: [instanceId] };
      }
   });
}

if( completed('step3') ) {
   stop({
      result: 'Everything is good !'
   });
}

