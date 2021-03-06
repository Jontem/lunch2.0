import { exhaustiveCheck } from "ts-exhaustive-check";
import { getData } from "./get-data";
import { parse } from "./parser";
import { RouteResult } from "./route-result";

export async function testApi(cachePath: string): Promise<RouteResult> {
  const res = await getData(cachePath);
  switch (res.type) {
    case "Success": {
      const parsed = parse(res.data).filter(r => r.menu);
      return {
        body: parsed,
        statusCode: 200
      };
    }
    case "Failure": {
      return {
        body: res,
        statusCode: 500
      };
    }
    default: {
      exhaustiveCheck(res);
      return {
        body: "Not possible",
        statusCode: 500
      };
    }
  }
}
