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
    return { type: "Success", data: cacheResult.data };
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

  const data = matches[1];
  await saveToCache(cachePath, data);

  return {
    type: "Success",
    data
  };
}

type CacheResult = { type: "NotLoaded" } | { type: "Loaded"; data: string };

async function getFromCache(cachePath: string): Promise<CacheResult> {
  return new Promise<CacheResult>(resolve => {
    fs.readFile(
      `${cachePath}/${getCacheFileName()}`,
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
          data: data
        });
      }
    );
  });
}

async function saveToCache(cachePath: string, data: string): Promise<void> {
  return new Promise<void>(resolve => {
    fs.writeFile(
      `${cachePath}/${getCacheFileName()}`,
      data,
      {
        encoding: "utf8"
      },
      err => {
        if (err) {
          console.dir(err);
        }
        resolve();
      }
    );
  });
}

type FetchResult =
  | { type: "Success"; html: string }
  | { type: "Failure"; code: number; text: string };

async function getFromServer(): Promise<FetchResult> {
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

function getCacheFileName(): string {
  return `${getCurrentDate()}.txt`;
}

function getCurrentDate(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${month}-${day}`;
}
