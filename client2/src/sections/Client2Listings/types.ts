export interface Listing {
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
/**
 * 请求所有Listing的数据时，必须包含一个listings字段
 */
export type ListingsData = {
  listings: Listing[];
};

/**
 * 删除Listing数据时，必须返回一个deleteListing字段的数据
 */

//  TODO: 这里Lisiting定义了很多shape，但是我只要了一个id数据，不会出错的原因是什么？
export interface DeleteListingData {
  deleteListing: Listing;
}

export interface DeleteListingVariables {
  id: string;
}
