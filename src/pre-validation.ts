import * as fs from "fs";

export function preValidation(cachePath: string): void {
  if (!fs.existsSync(cachePath)) {
    console.log("Cache dir doesn't exists. Creating..");
    fs.mkdirSync(cachePath);
  }
}
