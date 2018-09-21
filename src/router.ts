import * as Koa from "koa";
import { exhaustiveCheck } from "ts-exhaustive-check";
import { slack } from "./slack-api";
import { testApi } from "./test-api";

export function createRouter(
  cachePath: string
): (ctx: Koa.Context) => Promise<void> {
  return async function Router(ctx) {
    const route = matchRoute(ctx);
    switch (route) {
      case "slack": {
        console.log(ctx.request.body);
        const { body, statusCode } = await slack(cachePath, ctx.request
          .body as any);
        ctx.body = body;
        ctx.res.statusCode = statusCode;
        return;
      }
      case "test": {
        const { body, statusCode } = await testApi(cachePath);
        ctx.body = "hello test";
        ctx.body = body;
        ctx.res.statusCode = statusCode;
        return;
      }
      case "root": {
        ctx.body = "Welcome";
        return;
      }
      default: {
        exhaustiveCheck(route, true);
      }
    }
  };
}

type Route = "root" | "slack" | "test";

function matchRoute(ctx: Koa.Context): Route {
  console.log(ctx.path);
  console.log(ctx.method);

  if (ctx.method === "POST" && ctx.path === "/slack-api/v1") {
    return "slack";
  }

  if (ctx.method === "GET" && ctx.path === "/api/v1") {
    return "test";
  }

  return "root";
}
