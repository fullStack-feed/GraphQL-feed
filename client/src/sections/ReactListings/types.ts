interface testListing {
  id: string;
  title: string;
  image: string;
  address: string;
  price: number;
  numOfGuests: number;
  numOfBeds: number;
  numOfBaths: number;
  rating: number;
}

export type ListingsData = {
  listings: testListing[];
};

export interface DeleteListingData {
  deleteListing: testListing;
}
export interface DeleteListingVariables {
  id: string;
}
