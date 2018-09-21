import { exhaustiveCheck } from "ts-exhaustive-check";
import { getData } from "./get-data";
import { parse } from "./parser";
import { RouteResult } from "./route-result";

export async function slack(cachePath: string): Promise<RouteResult> {
  const res = await getData(cachePath);
  switch (res.type) {
    case "Success": {
      const parsed = parse(res.data);
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
        body: {},
        statusCode: 500
      };
    }
  }
}
