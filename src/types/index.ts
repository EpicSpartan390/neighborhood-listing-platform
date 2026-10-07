export interface Property {
  id: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  imageSrc: string;
  imageAlt: string;
  listingUrl: string;
}

export interface Sponsor {
  id: string;
  businessName: string;
  imageSrc: string;
  imageAlt: string;
  businessUrl: string;
  description?: string;
}
