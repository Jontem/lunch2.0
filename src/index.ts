import * as Koa from "koa";
import { exhaustiveCheck } from "ts-exhaustive-check";
import { getData } from "./get-data";
import { parse } from "./parser";

const app = new Koa();

app.use(async ctx => {
  const res = await getData();
  switch (res.type) {
    case "Sucess": {
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

app.listen(3000);
