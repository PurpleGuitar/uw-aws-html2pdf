var OUTPUT_S3_DIR = "outbound";
var OUTPUT_S3_EXTENSION = "md";
var INPUT_FILENAME = "/tmp/input.html";
var OUTPUT_FILENAME = "/tmp/output." + OUTPUT_S3_EXTENSION;

exports.handle = function(event, context) {

    // Get bucket and file from event
    var bucket_name = event.Records[0].s3.bucket.name;
    var object_key = event.Records[0].s3.object.key;

    // Download file from S3
    var aws = require('aws-sdk');
    var s3 = new aws.S3();
    var params = {
        Bucket: bucket_name,
        Key: object_key
    };
    var getObjectPromise = s3.getObject(params).promise();
    getObjectPromise.then(function(data) {

        console.log(
            'Successfully downloaded ' +
            object_key +
            " from S3 bucket " +
            bucket_name);

        // Write input file to local filesystem
        var fs = require("fs");
        fs.writeFileSync(INPUT_FILENAME,
            data.Body.toString("utf8"));

        // Convert to output format
        var pandoc = require('pandoc');
        var resultPromise =
            pandoc(INPUT_FILENAME, OUTPUT_FILENAME);
        resultPromise.then(function(value) {

            console.log(
                'Successfully converted ' +
                object_key + " to " +
                OUTPUT_S3_EXTENSION);

            // Get filename of input file with no extension
            var path = require('path');
            var inputS3FilenameNoExt =
                path.parse(object_key).name;

            // Upload to S3
            var fs = require("fs");
            var outputData = fs.readFileSync(
                OUTPUT_FILENAME, 'utf-8');
            var outputS3Filename = OUTPUT_S3_DIR + "/" +
                inputS3FilenameNoExt + "." +
                OUTPUT_S3_EXTENSION;
            var params = {
                Bucket: bucket_name,
                Key: outputS3Filename,
                Body: outputData
            };
            var putObjectPromise =
                s3.putObject(params).promise();
            putObjectPromise.then(function(data) {
                console.log(
                    'Successfully uploaded ' +
                    outputS3Filename +
                    " to S3 bucket " +
                    bucket_name);
            }).catch(function(err) {
                console.log(err);
            });

        });

    }).catch(function(err) {
        console.log(err);
    });

};
