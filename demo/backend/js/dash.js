function init() {
    // Initialize the Amazon Cognito credentials provider
    AWS.config.region = "us-east-1"; // Region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: "us-east-1:566d5a58-609c-4ec6-85f3-be20d008cfbd"
    });

    AWS.config.credentials.get(function () {
        console.log("updated aws config with web identity federation:\n", AWS.config.credentials);
        AWS.config.identityId = AWS.config.credentials.identityId;
        console.log("identityId:", AWS.config.identityId);
    });

    var dateTime = [];
    var usersCounter = [];
    var androidUsers = [];
    var iOSUsers = [];
    var windowsUsers = [];
    var otherUsers = [];
    var quadA = [];
    var quadB = [];
    var quadC = [];
    var quadD = [];

    var osUsageData = [];
    var quadrantData = [];

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

    var osChartConfig = {
        type: 'pie',
        data: {
            labels: [
                "Android",
                "iOS",
                "Windows Phone",
                "Other"
            ],
            datasets: [
                {
                    data: osUsageData,
                    backgroundColor: [
                        "#3498DB",
                        "#1ABB9C",
                        "#9B59B6",
                        "#9CC2CB"
                    ]
                }
            ]
        },
        options: {
            title: {
                display: false,
                text: "Operating System Usage",
                fontSize: 24
            },
            legend: {
                display: true
            },
            responsive: true
        }
    };


    var quadrantChartConfig = {
        type: "horizontalBar",
        data: {
            labels: [
                "A",
                "B",
                "C",
                "D"
            ],
            datasets: [
                {

                    data: quadrantData,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }
            ]
        },
        options: {
            legend: {
                display: false
            },

            responsive: true,
            scales: {
                yAxes: [{
                   stacked: true
                }],
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: false
                    },
                    ticks: {
                        stepSize: 10,
                        suggestedMin: 0,
                        suggestedMax: 10

                    }
                }]
            }
        }
    };




    var ctx = document.getElementById("uniqueUsersCanvas").getContext("2d");
    var uniqueUsersChart = new Chart(ctx, uniqueUsersChartConfig);

    var osCtx = document.getElementById("osCanvas").getContext("2d");
    var osChart = new Chart(osCtx, osChartConfig);


    var quadCtx = document.getElementById("quadrantCanvas").getContext("2d");
    var quadChart = new Chart(quadCtx, quadrantChartConfig);

    var firstRecord = 0;
    var lastRecord = 0;
    var noNewRecordCount = 0;

    var uniqueUserCount = 0,
        androidCount = 0,
        iosCount = 0,
        windowsCount = 0,
        otherCount = 0,
        quadACount = 0,
        quadBCount = 0,
        quadCCount = 0,
        quadDCount = 0;

    function getLatestRecord(){

        var params = {
            TableName: "user-quadrant-data",
            ConsistentRead: false,
            ScanIndexForward: false,
            KeyConditionExpression: 'dataType = :type',
            ExpressionAttributeValues: {
                ":type": "quadrantRollup"
            },
            Limit: 1
        };

        var docClient = new AWS.DynamoDB.DocumentClient();


        docClient.query(params, function(err, data) {
            if (err) console.log(err);
            else {
                console.log(data);

                if(firstRecord == 0 && data.Items.length > 0) {
                    //if this is the first record, we're just going to ignore it because it
                    //was likely in the table from a while ago and the data isn't valid for the current time
                    //we'll start buildng the chart with subsequent records.
                    firstRecord = data.Items[0].windowtime;
                    return;
                }

                if(data.Items.length > 0 && data.Items[0].windowtime > firstRecord) {
                    if(data.Items[0].windowtime > lastRecord) {
                        uniqueUserCount = data.Items[0].userCount;
                        androidCount = data.Items[0].androidCount;
                        iosCount = data.Items[0].iosCount;
                        windowsCount = data.Items[0].windowsCount;
                        otherCount = data.Items[0].otherOSCount;
                        quadACount = data.Items[0].quadrantA;
                        quadBCount = data.Items[0].quadrantB;
                        quadCCount = data.Items[0].quadrantC;
                        quadDCount = data.Items[0].quadrantD;

                        osUsageData[0] = androidCount;
                        osUsageData[1] = iosCount;
                        osUsageData[2] = windowsCount;
                        osUsageData[3] = otherCount;


                        quadrantData[0] = quadACount;
                        quadrantData[1] = quadBCount;
                        quadrantData[2] = quadCCount;
                        quadrantData[3] = quadDCount;

                        $("#unique_count").text(uniqueUserCount);
                        $("#A_count").text(quadACount);
                        $("#B_count").text(quadBCount);
                        $("#C_count").text(quadCCount);
                        $("#D_count").text(quadDCount);

                        if(uniqueUserCount > 0) {

                            $("#A_percent").text(Math.round((quadACount / uniqueUserCount) * 1000) / 10);
                            $("#B_percent").text(Math.round((quadBCount / uniqueUserCount) * 1000) / 10);
                            $("#C_percent").text(Math.round((quadCCount / uniqueUserCount) * 1000) / 10);
                            $("#D_percent").text(Math.round((quadDCount / uniqueUserCount) * 1000) / 10);
                        }


                        lastRecord = data.Items[0].windowtime;

                        noNewRecordCount = 0;
                    } else {
                        console.log("no new data");

                        noNewRecordCount++;

                        //let's assume that if we have 3 reads where we're not getting new data, that
                        //there's is no new data (i.e. no users) so we'll reset
                        if(noNewRecordCount == 10) {
                            uniqueUserCount = 0;
                            androidCount = 0;
                            iosCount = 0;
                            windowsCount = 0;
                            otherCount = 0;
                            quadACount = 0;
                            quadBCount = 0;
                            quadCCount = 0;
                            quadDCount = 0;

                            osUsageData[0] = osUsageData[1] = osUsageData[2] = osUsageData[3] = 0;
                            quadrantData[0] = quadrantData[1] = quadrantData[2] = quadrantData[3] = 0;

                            noNewRecordCount = 0;
                        }


                    }
                }

                //we want to keep the total data points for this chart to 180 (3 minutes)
                if(dateTime.length == 180) {
                    dateTime.shift();
                    usersCounter.shift();
                    androidUsers.shift();
                    iOSUsers.shift();
                    windowsUsers.shift();
                    otherUsers.shift();
                    quadA.shift();
                    quadB.shift();
                    quadC.shift();
                    quadD.shift();
                }

                dateTime.push(timeNow());
                usersCounter.push(uniqueUserCount);
                androidUsers.push(androidCount);
                iOSUsers.push(iosCount);
                windowsUsers.push(windowsCount);
                otherUsers.push(otherCount);
                quadA.push(quadACount);
                quadB.push(quadBCount);
                quadC.push(quadCCount);
                quadD.push(quadDCount);

            }

            uniqueUsersChart.update();
            osChart.update();
            quadChart.update();

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
