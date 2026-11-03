# Compile-Time Types vs. Runtime Validation Audit

## 1. Conceptual Distinction

TypeScript types provide compile-time protection while source code is being checked and compiled. They help developers detect incorrect assignments, incompatible function arguments, and unsafe property access before the application runs.

TypeScript types do not validate external data at runtime. Type information is erased when TypeScript is compiled to JavaScript, so interfaces and type aliases do not exist in the running application. Data received from JSON files, APIs, form submissions, or other external sources can therefore violate a TypeScript interface even when the project passes `tsc`.

A type assertion such as:

```ts
JSON.parse(rawJson) as PropertyListingContract
```

does not inspect or transform the parsed value. It only tells the compiler to trust the developer's claim. Runtime validation is still required at the point where untrusted data enters the application.

## 2. Exact Property Contract Type

The following interface is generated from `schemas/property-dataset.schema.json` in `src/types/property-dataset-contract.generated.ts`:

```ts
export interface PropertyListingContract {
  /**
   * Unique synthetic identifier for the property.
   */
  property_id: string;
  address: {
    street: string;
    city: string;
    state: string;
  };
  /**
   * A five-digit or ZIP+4 postal code.
   */
  zip_code: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  amenities: (
    "AIR_CONDITIONING" | "CENTRAL_HEATING" | "GARAGE_PARKING" | "SWIMMING_POOL" | "EV_CHARGING" | "SOLAR_PANELS"
  )[];
  /**
   * Local placeholder image used for synthetic property records.
   */
  image_src: "/property-placeholder.svg";
  image_alt: string;
  /**
   * A fictional example.com listing URL.
   */
  listing_url: string;
  /**
   * @minItems 1
   * @maxItems 2
   */
  local_sponsors:
    | [
        {
          sponsor_id: string;
          business_name: string;
          tier: "standard" | "premium" | "exclusive";
          target_url: string;
          image_src: "/sponsor-market.svg" | "/sponsor-repair.svg";
          image_alt: string;
          description?: string;
        }
      ]
    | [
        {
          sponsor_id: string;
          business_name: string;
          tier: "standard" | "premium" | "exclusive";
          target_url: string;
          image_src: "/sponsor-market.svg" | "/sponsor-repair.svg";
          image_alt: string;
          description?: string;
        },
        {
          sponsor_id: string;
          business_name: string;
          tier: "standard" | "premium" | "exclusive";
          target_url: string;
          image_src: "/sponsor-market.svg" | "/sponsor-repair.svg";
          image_alt: string;
          description?: string;
        }
      ];
}
```

The generated type gives the project a compile-time representation of the JSON Schema contract. Ajv remains responsible for enforcing that contract at runtime.

## 3. Unsafe External-Input Assertion

The audit includes this intentionally unsafe function:

```ts
export function unsafeParseProperty(
  rawJson: string,
): PropertyListingContract {
  return JSON.parse(rawJson) as PropertyListingContract;
}
```

The function compiles successfully because the `as PropertyListingContract` assertion instructs TypeScript to trust the declared type. TypeScript cannot determine whether the JSON string actually contains a valid property.

The successful `tsc --noEmit` run therefore demonstrates only that the TypeScript source is internally type-consistent. It does not prove that the external JSON value satisfies the contract.

## 4. Faulty Payload A: Runtime Type Mismatch

The first faulty payload supplies the price as a string:

```json
{
  "property_id": "10000000-0000-4000-8000-000000000001",
  "address": {
    "street": "101 Fictional Vista Lane",
    "city": "Pasadena",
    "state": "CA"
  },
  "zip_code": "91101",
  "price": "1150000",
  "bedrooms": 3,
  "bathrooms": 2.5,
  "square_feet": 1950,
  "amenities": [
    "GARAGE_PARKING",
    "AIR_CONDITIONING"
  ],
  "image_src": "/property-placeholder.svg",
  "image_alt": "Fictional placeholder representing a craftsman home.",
  "listing_url": "https://example.com/listings/property-1",
  "local_sponsors": [
    {
      "sponsor_id": "20000000-0000-4000-8000-000000000001",
      "business_name": "Palisades Community Market - Demo Sponsor",
      "tier": "standard",
      "target_url": "https://example.com/sponsors/community-market",
      "image_src": "/sponsor-market.svg",
      "image_alt": "Illustration of a fictional community market.",
      "description": "Fictional sponsor used only for course testing."
    }
  ]
}
```

The contract requires `price` to be a number. The unsafe assertion nevertheless allows the program to treat the string as a number.

This code compiles:

```ts
const property = unsafeParseProperty(typeMismatchPayload);
return property.price.toFixed(2);
```

At runtime, it throws a `TypeError` because the actual string value does not provide the numeric `toFixed` method.

The runtime validator rejects this payload with an error equivalent to:

```text
/price: must be number
```

## 5. Faulty Payload B: Domain Invariant Violation

The second faulty payload uses a number with an invalid business value:

```json
{
  "property_id": "10000000-0000-4000-8000-000000000001",
  "address": {
    "street": "101 Fictional Vista Lane",
    "city": "Pasadena",
    "state": "CA"
  },
  "zip_code": "91101",
  "price": -500000,
  "bedrooms": 3,
  "bathrooms": 2.5,
  "square_feet": 1950,
  "amenities": [
    "GARAGE_PARKING",
    "AIR_CONDITIONING"
  ],
  "image_src": "/property-placeholder.svg",
  "image_alt": "Fictional placeholder representing a craftsman home.",
  "listing_url": "https://example.com/listings/property-1",
  "local_sponsors": [
    {
      "sponsor_id": "20000000-0000-4000-8000-000000000001",
      "business_name": "Palisades Community Market - Demo Sponsor",
      "tier": "standard",
      "target_url": "https://example.com/sponsors/community-market",
      "image_src": "/sponsor-market.svg",
      "image_alt": "Illustration of a fictional community market.",
      "description": "Fictional sponsor used only for course testing."
    }
  ]
}
```

The value `-500000` is a valid TypeScript `number`, so the TypeScript interface alone cannot reject it. However, it violates the JSON Schema business rule requiring the price to be greater than or equal to zero.

The runtime validator rejects this payload with an error equivalent to:

```text
/price: must be >= 0
```

This demonstrates that compile-time types cannot express or enforce every domain invariant present in a runtime data contract.

## 6. Runtime Boundary Defense

The safe parsing function treats the result of `JSON.parse` as `unknown` and validates it before returning a typed value:

```ts
export function safelyParseProperty(
  rawJson: string,
): PropertyListingContract {
  const parsedValue: unknown = JSON.parse(rawJson);
  const result = validateProperty(parsedValue);

  if (!result.valid) {
    const details = result.errors
      .map((error) => {
        const location = error.instancePath || "/";
        return `${location}: ${error.message ?? "invalid value"}`;
      })
      .join("; ");

    throw new Error(`Property validation failed: ${details}`);
  }

  return result.data;
}
```

This approach establishes a runtime trust boundary:

1. External JSON begins as `unknown`.
2. Ajv evaluates the value against the JSON Schema.
3. Invalid data produces validation errors.
4. Only validated data is returned as `PropertyListingContract`.
5. Normalization and UI code receive a predictable data structure.

The same JSON Schema is used to generate the TypeScript contract and perform runtime validation, reducing the chance that compile-time and runtime definitions will drift apart.

## 7. Test Evidence

`tests/compile-time-audit.test.ts` contains four audit tests:

1. An unsafe assertion permits a string price and causes a runtime `TypeError`.
2. An unsafe assertion permits a negative numeric price.
3. Runtime validation rejects the string price.
4. Runtime validation rejects the negative price.

Verification completed successfully:

```text
Test Files  3 passed (3)
Tests       14 passed (14)
```

The following checks also passed:

```text
npm.cmd run lint
npm.cmd exec tsc -- --noEmit
```

## Conclusion

TypeScript provides valuable compile-time feedback, but it cannot establish that external data is trustworthy. Type erasure removes interfaces from the running JavaScript, and type assertions can silence compiler uncertainty without performing validation.

This project therefore uses both layers:

- Generated TypeScript types provide compile-time developer safety.
- JSON Schema and Ajv provide runtime protection at external-data boundaries.

Using both prevents runtime type mismatches and enforces business rules such as nonnegative property prices.