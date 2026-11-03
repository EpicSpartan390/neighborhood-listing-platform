/**Generated-from-JSON-Schema.-Do-not-edit-manually.*/

/**
 * A labeled collection of five fictional property records generated for course testing.
 */
export interface SyntheticPropertyDataset {
  _metadata: {
    synthetic: true;
    schema_version: "1.0.0";
    generated_by: "Google AI Studio";
    purpose: "Course lab seed fixtures only";
  };
  /**
   * @minItems 5
   * @maxItems 5
   */
  records: [
    PropertyListingContract,
    PropertyListingContract,
    PropertyListingContract,
    PropertyListingContract,
    PropertyListingContract
  ];
}
/**
 * Runtime data contract for a fictional residential property listing.
 */
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
