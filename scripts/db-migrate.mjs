import fs from "node:fs";
import path from "node:path";
import pg from "pg";

const { Client } = pg;

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = val;
  }
}

loadEnvLocal();

const databaseUrl =
  process.env.DATABASE_URL || "postgres://postgres:postgres@127.0.0.1:54329/g1_virtua_labs";

async function run() {
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    const migrationsDir = path.resolve(process.cwd(), "db/migrations");
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migration (
        version text PRIMARY KEY,
        applied_at timestamptz NOT NULL DEFAULT now()
      );
    `);

    const applied = await client.query("SELECT version FROM schema_migration");
    const appliedSet = new Set(applied.rows.map((r) => r.version));

    for (const file of files) {
      if (appliedSet.has(file)) {
        console.log(`[db:migrate] Skipping already applied migration: ${file}`);
        continue;
      }
      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
      console.log(`[db:migrate] Applying migration: ${file}`);
      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query("INSERT INTO schema_migration(version) VALUES ($1) ON CONFLICT DO NOTHING", [file]);
        await client.query("COMMIT");
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      }
      console.log(`[db:migrate] Applied: ${file}`);
    }
  } finally {
    await client.end();
  }
}

run().catch((err) => {
  console.error("[db:migrate] Failed:", err);
  process.exit(1);
});
