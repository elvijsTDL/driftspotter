import { readFileSync } from "fs";
import pg from "pg";

// Parse .env.local
const envFile = readFileSync(".env.local", "utf-8");
const env = {};
for (const line of envFile.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const idx = trimmed.indexOf("=");
  if (idx === -1) continue;
  env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
}

// Construct the Supabase database connection string
// Format: postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
const supabaseUrl = env["NEXT_PUBLIC_SUPABASE_URL"];
const serviceKey = env["SUPABASE_SERVICE_ROLE_KEY"];
const dbPassword = env["SUPABASE_DB_PASSWORD"];

if (!supabaseUrl) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL");
  process.exit(1);
}

const projectRef = supabaseUrl.replace("https://", "").replace(".supabase.co", "");

// If we have a direct DB password, use it
// Otherwise try the service role key approach
let connectionString;
if (dbPassword) {
  connectionString = `postgresql://postgres.${projectRef}:${dbPassword}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`;
} else {
  // Use the direct connection (port 5432) with the Supabase project password
  // The service role key is NOT the DB password - we need the actual DB password
  console.error("No SUPABASE_DB_PASSWORD found in .env.local");
  console.error("");
  console.error("To run the migration, add your Supabase database password to .env.local:");
  console.error("  SUPABASE_DB_PASSWORD=your-database-password");
  console.error("");
  console.error("You can find it in Supabase Dashboard:");
  console.error(`  https://supabase.com/dashboard/project/${projectRef}/settings/database`);
  console.error("");
  console.error("Alternatively, run the SQL manually in Supabase Dashboard:");
  console.error(`  https://supabase.com/dashboard/project/${projectRef}/sql`);
  process.exit(1);
}

console.log(`Connecting to Supabase database (${projectRef})...\n`);

const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } });
await client.connect();

const sql = readFileSync("supabase/event-management-migration.sql", "utf-8");

// Split into individual statements, handling $$ function bodies
const statements = [];
let current = "";
let inDollarQuote = false;
for (const line of sql.split(/\r?\n/)) {
  if (line.trim().startsWith("--") && !inDollarQuote) continue;
  current += line + "\n";

  const dollarCount = (line.match(/\$\$/g) || []).length;
  if (dollarCount % 2 === 1) inDollarQuote = !inDollarQuote;

  if (!inDollarQuote && line.trim().endsWith(";")) {
    const trimmed = current.trim();
    if (trimmed.length > 1) statements.push(trimmed);
    current = "";
  }
}
if (current.trim().length > 1) statements.push(current.trim());

console.log(`Running ${statements.length} statements...\n`);

let success = 0;
let failed = 0;

for (let i = 0; i < statements.length; i++) {
  const stmt = statements[i];
  const label = stmt.split("\n").find(l => l.trim().length > 0)?.trim().slice(0, 80) || `Statement ${i+1}`;

  try {
    await client.query(stmt);
    console.log(`  [${i+1}/${statements.length}] OK: ${label}`);
    success++;
  } catch (e) {
    if (e.message?.includes("already exists") || e.message?.includes("does not exist")) {
      console.log(`  [${i+1}/${statements.length}] SKIP: ${label} (${e.message.slice(0, 60)})`);
      success++;
    } else {
      console.error(`  [${i+1}/${statements.length}] FAIL: ${label}`);
      console.error(`        ${e.message}\n`);
      failed++;
    }
  }
}

await client.end();

console.log(`\nDone. ${success} succeeded, ${failed} failed.`);
if (failed > 0) process.exit(1);
