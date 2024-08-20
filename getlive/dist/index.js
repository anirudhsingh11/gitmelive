"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const simple_git_1 = __importDefault(require("simple-git"));
const utils_1 = require("./utils");
const files_1 = require("./files");
//import fs from "fs";
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json()); //middleware 
//expose a endpoint where frontend can call
app.post("/deploy", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const repourl = req.body.repourl;
    const id = (0, utils_1.generate)();
    yield (0, simple_git_1.default)().clone(repourl, path_1.default.join(__dirname, `output/${id}`));
    const files = (0, files_1.getAllFiles)(path_1.default.join(__dirname, `output/${id}`));
    console.log(files);
    res.json({
        id: id
    });
}));
app.listen(3000);
