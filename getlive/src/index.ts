import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { generate } from "./utils";
import { getAllFiles } from "./files";
//import fs from "fs";
import path from "path";
import { uploadFile } from "./aws";
//initise publisher for queue
import {createClient} from "redis";
const publisher = createClient();
publisher.connect();

const app  = express();
app.use(cors());
app.use(express.json());//middleware 
//expose a endpoint where frontend can call
app.post("/deploy", async (req, res) => {
    const repourl  = req.body.repourl;
    const id = generate();
    await simpleGit().clone(repourl, path.join(__dirname, `output/${id}`));
    const files = getAllFiles(path.join(__dirname, `output/${id}`));
    //console.log(files);
    files.forEach(async file => {
        // upload file to s3 bucket using aws sdk.
        //
        await uploadFile(file.slice(__dirname.length +1), file);
    })
    publisher.lPush("build-queue", id);
    res.json({
        id: id
    });
})
app.listen(3000);
