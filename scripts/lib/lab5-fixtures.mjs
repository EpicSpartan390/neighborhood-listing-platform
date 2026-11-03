// Shared fictional fixtures for the Lab 5 seed and subsequent role tests.
const id = (n) => `50000000-0000-4000-8000-${String(n).padStart(12, "0")}`;

export const fixtureIds = Object.freeze({
  draftA: id(1), draftB: id(2), approvedA: id(3),
  pendingA: id(4), rejectedA: id(5),
  activeSponsor: id(11), inactiveSponsor: id(12),
  inquiryA: id(21), inquiryB: id(22),
});

export function buildLab5Fixtures(ownerA, ownerB, admin) {
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (![ownerA, ownerB, admin].every((value) => typeof value === "string" && uuid.test(value))) {
    throw new Error("Use actual development Auth user UUIDs.");
  }
  if (new Set([ownerA, ownerB, admin]).size !== 3) {
    throw new Error("Owner A, Owner B, and administrator must be different accounts.");
  }
  const property = (key, owner, status) => ({
    id: fixtureIds[key], owner_id: owner,
    address: `Lab 5 Fictional ${key} Street`,
    price: 350000, bedrooms: 3, bathrooms: 2, square_feet: 1400, status,
  });
  return {
    profiles: [
      { id: ownerA, role: "property_owner" },
      { id: ownerB, role: "property_owner" },
      { id: admin, role: "admin" },
    ],
    sponsors: [
      { id: fixtureIds.activeSponsor, name: "Lab 5 Fictional Active Sponsor", tier: "gold", active_status: true },
      { id: fixtureIds.inactiveSponsor, name: "Lab 5 Fictional Inactive Sponsor", tier: "bronze", active_status: false },
    ],
    properties: [
      property("draftA", ownerA, "draft"), property("draftB", ownerB, "draft"),
      property("approvedA", ownerA, "approved"), property("pendingA", ownerA, "pending"),
      property("rejectedA", ownerA, "rejected"),
    ],
    property_sponsors: [
      { property_id: fixtureIds.approvedA, sponsor_id: fixtureIds.activeSponsor },
      { property_id: fixtureIds.approvedA, sponsor_id: fixtureIds.inactiveSponsor },
      { property_id: fixtureIds.draftA, sponsor_id: fixtureIds.activeSponsor },
    ],
    inquiries: [
      { id: fixtureIds.inquiryA, property_id: fixtureIds.approvedA, inquirer_email: "lab5-a@example.com", message: "Lab 5 fictional inquiry for Owner A." },
      { id: fixtureIds.inquiryB, property_id: fixtureIds.draftB, inquirer_email: "lab5-b@example.com", message: "Lab 5 fictional inquiry for Owner B." },
    ],
  };
}

// Only known fixtures may be restored. Never overwrite an unrelated row or role.
export function checkExistingSeedRows(table, existing, desired) {
  const fields = {
    profiles: ["role"], sponsors: ["name"],
    properties: ["owner_id", "address"], inquiries: ["property_id", "inquirer_email", "message"],
  }[table];
  if (!fields || !Array.isArray(existing)) throw new Error("Invalid seed preflight input.");
  for (const row of existing) {
    const expected = desired.find((item) => item.id === row.id);
    if (!expected || fields.some((field) => row[field] !== expected[field])) {
      throw new Error("Seed collision or account role mismatch; no writes should proceed.");
    }
  }
}
