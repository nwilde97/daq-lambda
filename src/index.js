"use strict";
const fs = require("fs").promises;
const AWS = require("aws-sdk");
const s3 = new AWS.S3({
    region: "us-west-2"
});

exports.handler = async () => {
}

const moveFile = async () => {
    try {
        const files = await fs.readdir("/ggc/in");
        await Promise.all(files.map(async file => {
            const output = `/ggc/out/${file}`;
            const input = `/ggc/in/${file}`;
            const stats = await fs.stat(input);
            if(stats.size == 142000){
                await fs.copyFile(input, output);
                await fs.unlink(input);
                const buffer = await fs.readFile(output);
                await s3.putObject({
                    Body: buffer,
                    Bucket: "bm-medical-data",
                    Key: `data/${file}`
                }).promise();
                console.log(`Moved ${file}`);
            }
        }));
    } catch (e){
        console.log(e);
    }
    setTimeout(moveFile, 500);
}

(async () => {
    console.log("Listening for files");
    setTimeout(moveFile, 100);
})();
