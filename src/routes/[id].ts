import { t } from "elysia";
import { ElysiaApp, server } from "..";

export default (app: ElysiaApp) =>
  app
    .use(server)
    .get(
      "/",
      ({ params, set }) => {
        const url = app.store.store.useLink(params.id);
        set.redirect = url;
      },
      {
        params: t.Object({
          id: t.String(),
        }),
      },
    )
    .delete(
      "/",
      ({ params }) => {
        app.store.store.deleteLink(params.id);
      },
      {
        params: t.Object({
          id: t.String(),
        }),
      },
    );
