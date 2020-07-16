import React from "react";
import { server } from "../../lib/api";
import {
  ListingsData,
  DeleteListingData,
  DeleteListingVariables,
} from "./types";

interface Props {
  title: string;
}

const LISTING = `
    query Listings {
        listings {
            id
            title
            image
        }
    }
`;

const DELETE_LISTING = `
		mutation DeleteListing($id: ID!) {
			deleteListing(id: $id) {
				id
				title
			}
		}
`;

export const ReactListings = ({ title }: Props) => {
  const fetchListings = async () => {
    // 这里使用一个泛型定义了我们希望返回的数据类型
    const { data } = await server.fetch<ListingsData>({ query: LISTING });
    console.log(data);
  };
  const deleteListing = async () => {
    // TODO:  泛型接口？我们在本应该传递类型的地方传递了接口？
    const { data } = await server.fetch<
      DeleteListingData,
      DeleteListingVariables
    >({
      query: DELETE_LISTING,
      variables: {
        id: "5f0efa8f93364a3850189d54", // hardcoded id variable,
      },
    });
    console.log(data);
  };
  return (
    <div>
      <h2>{title}</h2>
      <button onClick={fetchListings}>Query Listings!</button>
      <button onClick={deleteListing}>Delete a listing!</button>
    </div>
  );
};
