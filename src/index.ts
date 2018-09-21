import * as Koa from "koa";
import { config } from "./settings";
import { preValidation } from "./pre-validation";
import { createRouter } from "./router";
import * as bodyparser from "koa-bodyparser";

const cachePath = config.get("cachePath");
const port = config.get("port");

const app = new Koa();

app.use(bodyparser());
app.use(createRouter(cachePath));

app.listen(port);

console.log(`Listening on ${port}`);
console.log(`Using cachePath ${cachePath}`);

preValidation(cachePath);
