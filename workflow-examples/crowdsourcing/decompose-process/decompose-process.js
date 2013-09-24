/*global schedule,stop,file,results,workflow_input,start_childworkflow*/

// swf-start decompose-process "{\"taskDescription\":\"Create a website\"}"

/**
 * Step 1. Task identification
 */
if( has_workflow_just_started() ) {
  schedule({
    name: 'taskIdentification',
    activity: 'humantask',
    input: function() {
      return {
        data: workflow_input().taskDescription,
        template: file('./decompose-process/task-identification.html')
      };
    }
  }, {
      // No timeout
      heartbeatTimeout: "NONE",
      scheduleToCloseTimeout: "NONE",
      scheduleToStartTimeout: "NONE",
      startToCloseTimeout: "NONE"
   });
}


// exit cleanly if not splittable
if( completed('taskIdentification') && results('taskIdentification').splittable !== 'yes' ) {
  stop({
    result: {
      taskDescription: workflow_input().taskDescription,
      taskIdentification: results('taskIdentification')
    }
  });
}



/**
 * Step 2. Partition splittable tasks
 */
 if( completed('taskIdentification') && results('taskIdentification').splittable === 'yes' && !scheduled('splitTasks') ) {
  schedule({
    name: 'splitTasks',
    activity: 'humantask',
    input: function() {
      return {
        data: {
          taskDescription: workflow_input().taskDescription,
          taskIdentification: results('taskIdentification')
        },
        template: file('./decompose-process/split-task.html')
      };
    }
  }, {
      // No timeout
      heartbeatTimeout: "NONE",
      scheduleToCloseTimeout: "NONE",
      scheduleToStartTimeout: "NONE",
      startToCloseTimeout: "NONE"
   });
}


// recursion on the results("splitTasks") results

if( completed('splitTasks') ) {

  var i = 0;
  var allFinished = true;

  results('splitTasks').steps.forEach(function(step) {

    var subTaskName = 'sub-process-'+i

    i += 1;

    if( !childworkflow_scheduled(subTaskName) ) {

      start_childworkflow({
         name: subTaskName,
         workflow: 'decompose-process',
      }, {
         taskStartToCloseTimeout: "3600",
         executionStartToCloseTimeout: "3600",
         childPolicy: "TERMINATE",
         taskList: {
            name: 'aws-swf-tasklist'
         },
         input: {
            taskDescription: step
         }
      });

      allFinished = false;

    }
    else if ( !completed(subTaskName) ) {
      wait();
      allFinished = false;
    }

  });



  if( allFinished ) {
    stop({
      result: {
        taskDescription: workflow_input().taskDescription,
        taskIdentification: results('taskIdentification'),
        splitTasks: i > 0 ? {steps: (function() { var a=[]; for(var l=0;l<i;l++) { a.push(childworkflow_results("sub-process-"+(l+1))); } return a; })() } : results('splitTasks')
      }
    });
  }


}

