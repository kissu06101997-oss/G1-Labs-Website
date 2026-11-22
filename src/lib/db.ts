import { Pool, PoolClient, QueryResult, QueryResultRow } from "pg";

declare global {
  var __g1PgPool: Pool | undefined;
}

function getDatabaseUrl(): string {
  return (
    process.env.DATABASE_URL ||
    "postgres://postgres:postgres@127.0.0.1:54329/g1_virtua_labs"
  );
}

export function getPool(): Pool {
  if (!globalThis.__g1PgPool) {
    const url = getDatabaseUrl();
    const isLocalPglite =
      url.includes("127.0.0.1:54329") || url.includes("localhost:54329");
    const maxConnections = Number(
      process.env.PG_POOL_MAX || (isLocalPglite ? 1 : 10)
    );

    globalThis.__g1PgPool = new Pool({
      connectionString: url,
      max: maxConnections,
      idleTimeoutMillis: isLocalPglite ? 250 : 30_000,
      connectionTimeoutMillis: 15_000,
    });

    globalThis.__g1PgPool.on("error", (err) => {
      console.error("[g1-pg] Unexpected idle pool error:", err.message);
    });
  }
  return globalThis.__g1PgPool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  return getPool().query<T>(text, params);
}

export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch {
      // Ignore rollback errors after connection failure
    }
    throw err;
  } finally {
    client.release();
  }
}
