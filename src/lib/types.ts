import { Collection, ObjectID } from "mongodb";

export interface Listing {
  _id: ObjectID;
  title: string;
  image: string;
  address: string;
  price: number;
  numOfGuests: number;
  numOfBeds: number;
  numOfBaths: number;
  rating: number;
}

// 表示说这个Database接口中必须拥有listings字段，这个字段是...

// TODO: <> 这个是泛型接口？
export interface Database {
  listings: Collection<Listing>;
}
