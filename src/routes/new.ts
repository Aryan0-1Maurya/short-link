import Handlebars from "handlebars";
import { t } from "elysia";
import { server, ElysiaApp } from "..";

const postTemplate = Handlebars.compile(
  await Bun.file("./src/templates/add.html").text(),
);

export default (app: ElysiaApp) =>
  app
    .use(server)
    .get("/", () => Bun.file("./src/templates/new.html"))
    .post(
      "/",
      ({ body }) => {
        const id = app.store.store.addLink(body.link);

        return postTemplate({
          link: body.link,
          url: `http://localhost:${Bun.env["PORT"] ?? 3000}/${id}`,
        });
      },
      {
        body: t.Object({
          link: t.String(),
        }),
      },
    );
