import fetch from "node-fetch";
import * as fs from "fs";

type Result =
  | { type: "Failure"; error: any }
  | { type: "Success"; data: string };

// <input type="hidden" name="ctl00$HiddenField1" id="ctl00_HiddenField1" value="
const regex = /<input.+?id="ctl00_HiddenField1" value="(.+?)"/;

export async function getData(cachePath: string): Promise<Result> {
  const cacheResult = await getFromCache(cachePath);
  if (cacheResult.type === "Loaded") {
    return { type: "Success", data: cacheResult.html };
  }

  const fetchResult = await getFromServer();
  if (fetchResult.type === "Failure") {
    return {
      type: "Failure",
      error: fetchResult
    };
  }

  const matches = fetchResult.html.match(regex);
  if (!matches) {
    return {
      type: "Failure",
      error: "No matches"
    };
  }
  return {
    type: "Success",
    data: matches[1]
  };
}

type CacheResult = { type: "NotLoaded" } | { type: "Loaded"; html: string };

export async function getFromCache(cachePath: string): Promise<CacheResult> {
  const date = new Date().toLocaleDateString("sv-SE");

  return new Promise<CacheResult>(resolve => {
    fs.readFile(
      `${cachePath}/${date}.html`,
      { encoding: "utf8" },
      (err, data) => {
        if (err) {
          resolve({
            type: "NotLoaded"
          });
          return;
        }

        resolve({
          type: "Loaded",
          html: data
        });
      }
    );
  });
}

type FetchResult =
  | { type: "Success"; html: string }
  | { type: "Failure"; code: number; text: string };

export async function getFromServer(): Promise<FetchResult> {
  const result = await fetch("http://www.jlunch.se");
  if (!result.ok) {
    return {
      type: "Failure",
      code: result.status,
      text: result.statusText
    };
  }
  const html = await result.text();
  return {
    type: "Success",
    html
  };
}
