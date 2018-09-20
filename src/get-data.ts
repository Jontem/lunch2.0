import fetch from "node-fetch";

type Result =
  | { type: "Failure"; error: any }
  | { type: "Sucess"; data: string };

// <input type="hidden" name="ctl00$HiddenField1" id="ctl00_HiddenField1" value="
const regex = /<input.+?id="ctl00_HiddenField1" value="(.+?)"/;

export async function getData(): Promise<Result> {
  const result = await fetch("http://www.jlunch.se");
  if (!result.ok) {
    return {
      type: "Failure",
      error: result.statusText
    };
  }

  const html = await result.text();
  const matches = html.match(regex);
  if (!matches) {
    return {
      type: "Failure",
      error: "No matches"
    };
  }
  return {
    type: "Sucess",
    data: matches[1]
  };
}
