
schedule({
    name: 'step1',
    activity: 'sleep'
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
        input: 'this will be echoed...'
    });
}


if( completed('step3') ) {
    stop({
        result: {
            "step1": results('step1'),
            "step2": results('step2'),
            "step3": results('step3')
        }
    });
}

