import * as Koa from "koa";
import { config } from "./settings";
import { preValidation } from "./pre-validation";
import { createRouter } from "./router";

const cachePath = config.get("cachePath");

const app = new Koa();

app.use(createRouter(cachePath));

const port = 3000;
app.listen(port);

console.log(`Listening on ${port}`);
console.log(`Using cachePath ${cachePath}`);

preValidation(cachePath);
