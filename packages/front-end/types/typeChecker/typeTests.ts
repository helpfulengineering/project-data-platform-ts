import * as fs from "fs";
import { OKH_TYPE } from "../OKH.type";
import { OKW_TYPE } from "../OKW.type";

function loadJSON(filePath) {
  let fileData: string = fs.readFileSync(filePath, "utf-8");
  let jsonData = JSON.parse(fileData);
  return jsonData;
}

let RobsArduinoShop: OKH_TYPE = loadJSON("./jsonSamples/RobsArduinoShop.json");
let RobTestOKWForSewing: OKW_TYPE = loadJSON(
  "./jsonSamples/RobTestOKWForSewing.json"
);
