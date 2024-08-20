//
import {CostOptimizationHub, S3} from "aws-sdk";
import fs from "fs";

const s3 = new S3({
    accessKeyId: "your_access_key",
    secretAccessKey: "your_secret_key",
    endpoint: ""
})
 // Upload a file to S3
export const uploadFile = async(fileName: string, localFilePath: string) => {
    console.log("called");
    const fileContent = fs.readFileSync(fileName);
    const response = await s3.upload ( {
        Bucket: "your_bucket_name",
        Key: fileName,
        Body: fileContent,
        //ContentType: "application/octet-stream"
    }).promise(); 
}