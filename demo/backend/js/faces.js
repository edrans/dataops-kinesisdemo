var Region = ">>REGION<<";
var IdentityPoolId = ">>IDENTITY_POOL_ID<<";


Region = "us-east-1";
IdentityPoolId = "us-east-1:da0fcba0-02ef-434d-91be-966165ec2359";


function init() {
    // Initialize the Amazon Cognito credentials provider
    AWS.config.region = Region;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IdentityPoolId
    });

    AWS.config.credentials.get(function (err) {
        if(err) {
            console.log(err);
        } else {
            console.log("updated aws config with web identity federation:\n", AWS.config.credentials);
            AWS.config.identityId = AWS.config.credentials.identityId;
            console.log("identityId:", AWS.config.identityId);
        }
    });

    var dateTime = [];
    var usersCounter = [];
    var genderData = [];
    var beardData = [];
    var eyeglassesData = [];
    var smileData = [];
    var mustacheData = [];
    var sunglassesData = [];




    //Chart.js code
    var uniqueUsersChartConfig = {
        type: "line",
        data: {

            labels : dateTime,
            datasets : [
                {
                    label: "Total Unique Users",
                    borderColor : "rgba(151,187,205,1)",
                    data : usersCounter,
                    fill: true,
                    pointRadius: 0
                }

            ]
        },
        options: {
            legend: {
                display: false,
                position: "top"

            },
            animation: false,
            title: {
                display: false,
                text: "Unique Users",
                fontSize: 24
            },
            responsive: true,
            scales: {
                xAxes: [{
                    display: false,
                    scaleLabel: {
                        display: true,
                        labelString: 'Time (3 minutes)'
                    },
                    ticks: {
                        suggestedMin: 180,
                        suggestedMax: 180
                    }

                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: false
                    },
                    ticks: {
                        min: 0,
                        suggestedMax: 0,
                        stepSize: 20
                    }
                }]
            }
        }
    };

    var genderChartConfig = {
        type: 'pie',
        data: {
            labels: [
                "Male",
                "Female"
            ],
            datasets: [
                {
                    data: genderData,
                    backgroundColor: [
                        "#deeaee",
                        "#b1cbbb"
                    ]
                }
            ]
        },
        options: {
            title: {
                display: false,
                text: "Gender",
                fontSize: 24
            },

            responsive: true
        }
    };


    var beardChartConfig = {
        type: 'pie',
        data: {
            labels: [
                "Yes",
                "No"
            ],
            datasets: [
                {
                    data: beardData,
                    backgroundColor: [
                        "#deeaee",
                        "#b1cbbb"
                    ]
                }
            ]
        },
        options: {
            title: {
                display: false,
                text: "Beards",
                fontSize: 24
            },

            responsive: true
        }
    };

    var eyeglassesChartConfig = {
        type: 'pie',
        data: {
            labels: [
                "Yes",
                "No"
            ],
            datasets: [
                {
                    data: eyeglassesData,
                    backgroundColor: [
                        "#deeaee",
                        "#b1cbbb"
                    ]
                }
            ]
        },
        options: {
            title: {
                display: false,
                text: "Eyeglasses",
                fontSize: 24
            },

            responsive: true
        }
    };

    var smileChartConfig = {
        type: 'pie',
        data: {
            labels: [
                "Yes",
                "No"
            ],
            datasets: [
                {
                    data: smileData,
                    backgroundColor: [
                        "#deeaee",
                        "#b1cbbb"
                    ]
                }
            ]
        },
        options: {
            title: {
                display: false,
                text: "Smiling",
                fontSize: 24
            },

            responsive: true
        }
    };

    var mustacheChartConfig = {
        type: 'pie',
        data: {
            labels: [
                "Yes",
                "No"
            ],
            datasets: [
                {
                    data: mustacheData,
                    backgroundColor: [
                        "#deeaee",
                        "#b1cbbb"
                    ]
                }
            ]
        },
        options: {
            title: {
                display: false,
                text: "Mustache",
                fontSize: 24
            },

            responsive: true
        }
    };

    var sunglassesChartConfig = {
        type: 'pie',
        data: {
            labels: [
                "Yes",
                "No"
            ],
            datasets: [
                {
                    data: sunglassesData,
                    backgroundColor: [
                        "#deeaee",
                        "#b1cbbb"
                    ]
                }
            ]
        },
        options: {
            title: {
                display: false,
                text: "Sunglasses",
                fontSize: 24
            },

            responsive: true
        }
    };





    var ctx = document.getElementById("uniqueUsersCanvas").getContext("2d");
    var uniqueUsersChart = new Chart(ctx, uniqueUsersChartConfig);

    var genderCtx = document.getElementById("genderCanvas").getContext("2d");
    var genderChart = new Chart(genderCtx, genderChartConfig);

    var beardCtx = document.getElementById("beardCanvas").getContext("2d");
    var beardChart = new Chart(beardCtx, beardChartConfig);

    var eyeglassesCtx = document.getElementById("eyeglassesCanvas").getContext("2d");
    var eyeglassesChart = new Chart(eyeglassesCtx, eyeglassesChartConfig);

    var smilingCtx = document.getElementById("smilingCanvas").getContext("2d");
    var smilingChart = new Chart(smilingCtx, smileChartConfig);

    var mustacheCtx = document.getElementById("mustacheCanvas").getContext("2d");
    var mustacheChart = new Chart(mustacheCtx, mustacheChartConfig);

    var sunglassesCtx = document.getElementById("sunglassesCanvas").getContext("2d");
    var sunglassesChart = new Chart(sunglassesCtx, sunglassesChartConfig);


    var firstRecord = 0;
    var lastRecord = 0;
    var noNewRecordCount = 0;

    var uniqueUserCount = 0,
        maleCount = 0,
        femaleCount = 0,
        beardCount = 0,
        eyeglassesCount = 0,
        smileCount = 0,
        mustacheCount = 0,
        sunglassesCount = 0,
        avgMedianAge = 0;

    function getLatestRecord(){

        var params = {
            TableName: "selfie-data",
            ConsistentRead: false,
            ScanIndexForward: false,
            KeyConditionExpression: 'dataType = :type',
            ExpressionAttributeValues: {
                ":type": "selfieRollup"
            },
            Limit: 1
        };

        AWS.config.region = "us-west-2";
        var docClient = new AWS.DynamoDB.DocumentClient();


        docClient.query(params, function(err, data) {
            if (err) console.log(err);
            else {
                console.log(data);

                if(firstRecord == 0 && data.Items.length > 0) {
                    //if this is the first record, we're just going to ignore it because it
                    //was likely in the table from a while ago and the data isn't valid for the current time
                    //we'll start buildng the chart with subsequent records.
                    firstRecord = data.Items[0].windowTime;
                    return;
                }

                if(data.Items.length > 0 && data.Items[0].windowTime > firstRecord) {
                    if(data.Items[0].windowTime > lastRecord) {
                        uniqueUserCount = data.Items[0].userCount;

                        avgMedianAge = data.Items[0].avgMedianAge;
                        maleCount = data.Items[0].maleCount;
                        femaleCount = data.Items[0].femaleCount;
                        beardCount = data.Items[0].beardCount;
                        eyeglassesCount = data.Items[0].eyeglassesCount;
                        smileCount = data.Items[0].smileCount;
                        mustacheCount = data.Items[0].mustacheCount;
                        sunglassesCount = data.Items[0].sunglassesCount;


                        genderData[0] = maleCount;
                        genderData[1] = femaleCount;

                        beardData[0] = beardCount;
                        beardData[1] = uniqueUserCount - beardCount;

                        eyeglassesData[0] = eyeglassesCount;
                        eyeglassesData[1] = uniqueUserCount - eyeglassesCount;

                        smileData[0] = smileCount;
                        smileData[1] = uniqueUserCount - smileCount;

                        mustacheData[0] = mustacheCount;
                        mustacheData[1] = uniqueUserCount - mustacheCount;

                        sunglassesData[0] = sunglassesCount;
                        sunglassesData[1] = uniqueUserCount - sunglassesCount;


                        $("#unique_count").text(uniqueUserCount);
                        $("#male_count").text(maleCount);
                        $("#female_count").text(femaleCount);
                        $("#avg_median_age").text(Math.round(avgMedianAge * 10) / 10);

                        if(uniqueUserCount > 0) {

                            $("#male_percent").text(Math.round((maleCount / uniqueUserCount) * 1000) / 10);
                            $("#female_percent").text(Math.round((femaleCount / uniqueUserCount) * 1000) / 10);
                        }

                        lastRecord = data.Items[0].windowTime;

                        noNewRecordCount = 0;
                    } else {
                        console.log("no new data");

                        noNewRecordCount++;

                        //let's assume that if we have 3 reads where we're not getting new data, that
                        //there's is no new data (i.e. no users) so we'll reset
                        if(noNewRecordCount == 10) {
                            uniqueUserCount = 0;
                            avgMedianAge = 0;
                            maleCount = 0;
                            femaleCount = 0;
                            beardCount = 0;
                            eyeglassesCount = 0;
                            smileCount = 0;
                            mustacheCount = 0;
                            sunglassesCount = 0;

                            genderData[0] = 0;
                            genderData[1] = 0;

                            beardData[0] = 0;
                            beardData[1] = 0;

                            eyeglassesData[0] = 0;
                            eyeglassesData[1] = 0;

                            smileData[0] = 0;
                            smileData[1] =0;

                            mustacheData[0] = 0;
                            mustacheData[1] = 0;

                            sunglassesData[0] = 0;
                            sunglassesData[1] = 0;

                            noNewRecordCount = 0;

                            $("#unique_count").text(uniqueUserCount);
                            $("#male_count").text(maleCount);
                            $("#female_count").text(femaleCount);
                            $("#avg_median_age").text(Math.round(avgMedianAge * 10) / 10);
                            $("#male_percent").text("0");
                            $("#female_percent").text("0");

                        }


                    }
                }

                //we want to keep the total data points for this chart to 180 (3 minutes)
                if(dateTime.length == 180) {
                    dateTime.shift();
                    usersCounter.shift();
                }

                dateTime.push(timeNow());
                usersCounter.push(uniqueUserCount);

            }

            uniqueUsersChart.update();
            genderChart.update();
            beardChart.update();
            eyeglassesChart.update();
            smilingChart.update();
            mustacheChart.update();
            sunglassesChart.update();
        });

        setTimeout( function() {
            getLatestRecord();
        }, 1000);


    }

    getLatestRecord();


    function timeNow() {
        var d = new Date(),
            h = (d.getHours()<10?'0':'') + d.getHours(),
            m = (d.getMinutes()<10?'0':'') + d.getMinutes(),
            s = (d.getSeconds()<10?'0':'') + d.getSeconds();

        return h + ':' + m + ':' + s;
    }

}
