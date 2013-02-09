# aws-swf-activities :

Collections of:

  * ready-to-run activities
  * workflows examples


### New Module Ideas

* merge human task and email task into one ( + provide different backends, either files or DynamoDB)

* WebDriver activity (WIP)

* mturk: options for the poller (WIP)

* Document multi-activity package: 'ec2_runInstances' -> require('ec2').runInstances


## Usage


    # launch 5 activity workers in the activities/ directory
    # and 2 decider workers in the workflows/ directory
    swf-toolkit -w 5 -d 2

same as

    cd activities
    swf-activity
    cd workflows
    swf-decider




## License

[MIT License](https://raw.github.com/neyric/aws-swf/master/LICENSE.txt)

