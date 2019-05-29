
var IdentityPoolId = ">>IDENTITY_POOL_ID<<";
var Region = ">>REGION<<";

IdentityPoolId = "us-east-1:801a8eab-7daf-4764-8706-662d93a02b7b";
Region = "us-east-1";



var StreamName = "IoTSensorDemo";


// function to collect data and send it to Kinesis
function init() {

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


    var kinesis = new AWS.Kinesis();

    //get the client OS
    var os = getMobileOperatingSystem();
    console.log(os);

    // empty object for records
    var records = [];

    window.addEventListener('deviceorientation', handleOrientation);


    var ball   = document.querySelector('.ball');
    var garden = document.querySelector('.garden');
    var output = document.querySelector('.output');

    var maxX = garden.clientWidth  - ball.clientWidth;
    var maxY = garden.clientHeight - ball.clientHeight;


    var uiX, uiY;

    function handleOrientation(event) {

    	var y = event.beta;
        var x = event.gamma;

        // Because we don't want to have the device upside down
        // We constrain the x value to the range [0,90]
        if (y >  90) { y =  90};
        if (y < 0) { y = 0};

        if( x < -85 ) { x = -85 };
        if(x > 85) {x = 85 };

        uiY = y;
        uiX = x + 90;

        // 10 is half the size of the ball
        // It center the positioning point to the center of the ball
        ball.style.left  = (maxX*uiX/180 - 10) + "px";
        ball.style.top = (maxY*uiY/90 - 10) + "px";

    }



    // create JSON objec to put into kinesis
    function CreateKinesisInput() {

        var cT = new Date().getTime() / 1000;

        if (AWS.config.credentials.identityId != null) {

        	var quadrant;
        	
        	//  A | B
        	//  -----
        	//  C | D
        	
        	if(uiX >= 0 && uiX < 90 && uiY >=0 && uiY <= 45) {quadrant = 'A'}; 
        	if(uiX >= 90 && uiX <= 180 && uiY >=0 && uiY <= 45) {quadrant = 'B'}; 
        	if(uiX >= 0 && uiX < 90 && uiY > 45 && uiY <= 90) {quadrant = 'C'}; 
        	if(uiX >= 90 && uiX <= 180 && uiY > 45 && uiY <= 90) {quadrant = 'D'}; 
        	
        	
            var orientationData = {
                "recordTime": cT,
                "cognitoId": AWS.config.credentials.identityId,
                "device": navigator.platform,
                "os": os,
                "sensorname": "deviceOrientationEvent",
                "beta": uiX,
                "gamma": uiY,
                "quadrant": quadrant
            };

            records.push({
                Data: JSON.stringify(orientationData),
                PartitionKey: getRandomPartitionKey()
            });

        }

        // set timeout to collect data every dt-time
        setTimeout(function () {
            CreateKinesisInput()
        }, 1000);


    }

    CreateKinesisInput();


    // send records object to kinesis
    function SendKinesis() {

        if (records.length > 0) {
            var params = {
                Records: records,
                StreamName: StreamName
            };

            kinesis.putRecords(params, function (err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                //else     console.log(data);           // successful response
            });

            records = [];
        }

        setTimeout(function () {
            SendKinesis()
        }, 1000);

    }

    SendKinesis();


}

function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
        return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    return "other";
}


function getRandomPartitionKey() {

    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 256; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;

}

