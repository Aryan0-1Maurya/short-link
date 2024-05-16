import { ElysiaApp, server } from "..";
import Handlebars from "handlebars";

const indexTemplate = Handlebars.compile(
  await Bun.file("./src/templates/index.html").text(),
);

export default (app: ElysiaApp) =>
  app.use(server).get("/", () => indexTemplate({ version: app.store.version }));
