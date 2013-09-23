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
  });
}


// recursion on the results("splitTasks") results

if( completed('splitTasks') ) {

  var i = 0;
  if(results('splitTasks')) {
    results('splitTasks').steps.forEach(function(step) {

      i += 1;

      if( !scheduled('sub-process-'+i) ) {

        start_childworkflow({
           name: 'sub-process-'+i,
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

      }

    });

    if( i == 0 || completed('sub-process-'+(results('splitTasks').length -1) ) )

    stop({
      result: {
        taskDescription: workflow_input().taskDescription,
        taskIdentification: results('taskIdentification'),
        splitTasks: i > 0 ? {steps: (function() { var a=[]; for(var l=0;l<i;l++) { a.push(childworkflow_results("sub-process-"+(l+1))); } return a; })() } : results('splitTasks')
      }
    });

  }

}

