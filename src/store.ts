import { Database } from "bun:sqlite";
import crypto from "crypto";

export interface Link {
  id: string;
  url: string;
  createdAt: Date;
  useCount: number;
}

export class Store {
  private _database: Database;

  constructor() {
    this._database = new Database("short-link.db", { create: true });

    this._database.run(
      `CREATE TABLE IF NOT EXISTS "links" (
        "id"	TEXT NOT NULL UNIQUE,
        "url"	TEXT NOT NULL,
        "created_at"	TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "use_count"	INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY("id")
      );`,
    );
  }

  /**
   * Add a link to the database and generate an ID for it.
   *
   * @param url URL to add
   * @returns ID of the link
   */
  addLink(url: string): string {
    try {
      const id = crypto.randomBytes(8).toString("base64url");
      console.log(`Adding link ${id} -> ${url}`);

      const query = this._database.query(
        "INSERT INTO links (id, url) VALUES (?1, ?2)",
      );
      query.run(id, url);

      return id;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  /**
   * Fetch a link from the database and increment its use count.
   *
   * @param id ID of the link to use
   * @returns URL of the link
   */
  useLink(id: string): string {
    try {
      const query = this._database.query("SELECT url FROM links WHERE id = ?1");
      const link = query.get(id) as { url: string } | undefined;

      if (!link) {
        throw new Error(`Link ${id} not found`);
      }

      const update = this._database.query(
        "UPDATE links SET use_count = use_count + 1 WHERE id = ?1",
      );
      update.run(id);

      return link.url;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  /**
   * Get all links in the database.
   *
   * @returns All links in the database
   */
  getLinks(): Link[] {
    try {
      const query = this._database.query("SELECT * FROM links");
      const raw_links = query.all();

      Bun.sleepSync(2000);

      const links: Link[] = raw_links.map((link: any) => ({
        id: link.id,
        url: link.url,
        createdAt: new Date(link.created_at),
        useCount: link.use_count,
      }));

      return links as Link[];
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  /**
   * Delete a link from the database.
   *
   * @param id ID of the link to delete
   */
  deleteLink(id: string): void {
    try {
      const query = this._database.query("DELETE FROM links WHERE id = ?1");
      query.run(id);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
