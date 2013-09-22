
// Example of an aggregate (wait for multiple steps to complete)

schedule({
   name: 'step1',
   activity: 'sleep',
   input: {
      delay: 2000
   }
});


schedule({
   name: 'step2',
   activity: 'sum',
   input: {
      a: 4,
      b: 6
   }
});


if( completed('step1') && completed('step2') && !scheduled('step3') ) {
   schedule({
      name: 'step3',
      activity: 'echo',
      input: function() {
         var r = results('step2');
         return {
            resultat: r
         };
      }
   });
}


if( completed('step3') ) {
   stop({
      result: function() {
         return results('step3').resultat;
      }
   });
}