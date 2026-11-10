// Draft only: --dry-run is offline; --apply writes fictional development records.
import { buildLab5Fixtures, checkExistingSeedRows } from "./lib/lab5-fixtures.mjs";

import { prepareLab5Clients, Lab5SetupError } from "./lib/lab5-clients.mjs";

class SeedError extends Error {}
const offlineIds = [1, 2, 3].map((n) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`);

async function main() {
  const args = process.argv.slice(2);
  if (args.length !== 1 || !["--dry-run", "--apply"].includes(args[0])) {
    throw new SeedError("Choose --dry-run (offline) or --apply (development writes).");
  }
  if (args[0] === "--dry-run") {
    const fixtures = buildLab5Fixtures(...offlineIds);
    console.log("OFFLINE PREVIEW: no credentials loaded and no network requests sent.");
    console.log("Demonstration UUIDs are not used for real Auth accounts.");
    console.log(JSON.stringify(Object.fromEntries(Object.entries(fixtures).map(([table, rows]) => [table, rows.length])), null, 2));
    return;
  }

  const { users, service } = await prepareLab5Clients();
  const fixtures = buildLab5Fixtures(...users);
  const before = {};
  // Preflight all identities before making the first write.
  for (const table of ["profiles", "sponsors", "properties", "inquiries"]) {
    const result = await service.from(table).select("*").in("id", fixtures[table].map((row) => row.id));
    if (result.error || !Array.isArray(result.data)) throw new SeedError(`Preflight failed for ${table}; no seed rows written.`);
    checkExistingSeedRows(table, result.data, fixtures[table]);
    before[table] = result.data;
  }

  for (const table of ["profiles", "sponsors", "properties", "property_sponsors", "inquiries"]) {
    let rows = fixtures[table];
    // Create a profile only when absent; never update existing account roles.
    if (table === "profiles") rows = rows.filter((row) => !before.profiles.some((old) => old.id === row.id));
    if (!rows.length) continue;
    const result = table === "profiles"
      ? await service.from(table).insert(rows)
      : await service.from(table).upsert(rows, { onConflict: table === "property_sponsors" ? "property_id,sponsor_id" : "id" });
    if (result.error) throw new SeedError(`Seed write failed for ${table}. Earlier fictional writes may remain; inspect before retrying.`);
  }
  console.log("Fictional Lab 5 seed writes completed using real development Auth UUIDs.");
  console.log("Counts:", JSON.stringify(Object.fromEntries(Object.entries(fixtures).map(([table, rows]) => [table, rows.length]))));
  console.log("This administrative seed does not verify ordinary-user RLS. Run the separate role tests.");
}

main().catch((error) => {
  // Do not echo raw SDK errors, URLs, emails, passwords, keys, or tokens.
  console.error((error instanceof SeedError || error instanceof Lab5SetupError) ? error.message : "Seed stopped: configuration, fixture identity, or network failure. No raw credentials/errors printed.");
  process.exitCode = 1;
});
