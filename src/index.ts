import * as Koa from "koa";
import { exhaustiveCheck } from "ts-exhaustive-check";
import * as path from "path";
import { preValidation } from "./pre-validation";
import { getData } from "./get-data";
import { parse } from "./parser";

const cachePath = path.resolve(__dirname, "../cache");

const app = new Koa();

app.use(async ctx => {
  const res = await getData(cachePath);
  switch (res.type) {
    case "Success": {
      const parsed = parse(res.data);
      ctx.body = parsed;
      break;
    }
    case "Failure": {
      ctx.body = res;
      break;
    }
    default: {
      exhaustiveCheck(res);
    }
  }
});

const port = 3000;
app.listen(port);

console.log(`Listening on ${port}`);
console.log(`Using cachePath ${cachePath}`);
preValidation(cachePath);
