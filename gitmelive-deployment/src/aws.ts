 import {S3} from "aws-sdk";
 import {dir} from "console";
 import fs from "fs";
 import path from "path";

 const s3 = new S3({
    accessKeyId: 'YOUR_ACCESS_KEY_ID',
    secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
    endpoint:" "
 })
//output/uyu
 export async function downloadS3Folder(prefix: string){
    
     
    console.log(prefix); 
    const allFiles = await s3.listObjectsV2({
        Bucket: 'your-bucket',
        Prefix: prefix
    }).promise();

    const allPromises  = allFiles.Contents?.map(async({Key})=>{
        return new Promise(async (resolve) => {
            if(!Key){
                resolve("");
                return;
            } 
        const finalOutputPath  = path.join(__dirname, Key); //dist//output/1232
        
        const dirname = path.dirname(finalOutputPath);
        if (!fs.existsSync(dirname)) {
            fs.mkdirSync(dirname, { recursive: true });
        }
        const outputFile = fs.createWriteStream(finalOutputPath);//to download bif file we use write stream
        s3.getObject({
            Bucket: 'your-bucket',
            Key:Key || ""
        }).createReadStream().pipe(outputFile)
        .on("finish", () => {
            resolve("");
        })
    })
 }) || []
console.log("awaiting");
 await Promise.all(allPromises?.filter(x => x !== undefined));

 }
 //you can call this function as downloadS3Folder('output/uyu')
 export function copyFinalDist(id:string){
    const folderPath = path.join(__dirname, `output/${id}/dist`);
    const allFiles = getAllFiles(folderPath);
    allFiles.forEach(async (file) => {
        const relativePath = `dist/${id}/` + file.slice(folderPath.length + 1);
        await uploadFile(relativePath, file);
    });
 }
 const getAllFiles = (folderPath: string) => {
    let response: string[] = [];

    const allFilesAndFolders = fs.readdirSync(folderPath);allFilesAndFolders.forEach(file => {
        const fullFilePath = path.join(folderPath, file);
        if (fs.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath))
        } else {
            response.push(fullFilePath);
        }
    });
    return response;
}

const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "vercel",
        Key: fileName,
    }).promise();
    console.log(response);
}