import Handlebars from "handlebars";
import { ElysiaApp, server } from "..";

const linksTemplate = Handlebars.compile(
  await Bun.file("./src/templates/links.html").text(),
);

export default (app: ElysiaApp) =>
  app.use(server).get("/", () => {
    const links = app.store.store.getLinks();

    return linksTemplate({
      links: links.map((link) => ({
        ...link,
        createdAt: link.createdAt.toUTCString(),
      })),
    });
  });
