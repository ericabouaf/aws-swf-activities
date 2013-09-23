var worker = require('./xpathfetchpage').worker;

worker({

    config: {
        input: JSON.stringify({
            URL: "http://pinterest.com/popular/",
            xpath: "//img[@class='pinImg']"
        })
    },

    respondCompleted: function (results) {
        console.log("Done !");
        console.log(JSON.stringify(results, null, 3));
    }

});

