import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { staticPlugin } from "@elysiajs/static";
import { autoroutes } from "elysia-autoroutes";
import { Store } from "./store";
// @ts-ignore
import data from "../package.json";

export const server = new Elysia()
  .use(html())
  .use(staticPlugin())
  .get("/public/htmx.js", () =>
    Bun.file("node_modules/htmx.org/dist/htmx.min.js"),
  )
  .state("store", new Store())
  .state("version", data.version)
  .use(autoroutes())
  .onError(({ code, error }) => {
    console.error(code, error);
  })
  .listen(Bun.env["PORT"] ?? 3000);

console.log(
  `short-link is running at ${server.server?.hostname}:${server.server?.port}`,
);

export type ElysiaApp = typeof server;
