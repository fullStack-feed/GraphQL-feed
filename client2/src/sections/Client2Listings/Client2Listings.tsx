import React from "react";
import {
  ListingsData,
  DeleteListingData,
  DeleteListingVariables,
} from "./types";
import {useMutation, useQuery} from "../../lib/api";

interface Props {
  title: string;
}

const LISTINGS = `
	query Listings {
		listings {
      id
      title
      image
      address
      price
      numOfGuests
      numOfBeds
      numOfBaths
      rating
    }
	}
`;

const DELETE_LISTING = `
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      id
    }
  }
`;

export const Client2Listings = ({title}: Props) => {
  // const [listings, setListings] = useState<Listing[] | null>(null);
  // 使用useEffect在加载组件时发起网络请求
  // 注意这里的第二个参数
  // useEffect(() => {
  //   fetchListings();
  // });
  // 封装自定义hooks，来发起网络请求并返回数据

  // const fetchListings = async () => {
  //   // TODO: 还是分析不清楚这里定义了泛型能够有什么帮助？
  //   // 是指 网络请求回的数据，满足 ListingsData 这样的类型？
  //   const { data } = await server.fetch<ListingsData>({
  //     query: LISTINGS,
  //   });
  //   setListings(data.listings);
  // };
  // console.log(listings);

  const {data, refetch, error, loading} = useQuery<ListingsData>(LISTINGS);
  const [deleteListing, {loading: deleteListingLoading, error: deleteListingError}] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING)

  const handleDeleteListing = async (id: string) => {
    await deleteListing({
      id: id,
    });
    refetch();
  };


  const listings = data ? data.listings : null;
  const listingsList = listings ? ( // 渲染一个jsx时候，一定要保证当前这个数据是有效的
    <ul>
      {listings.map((listing) => {
        return (
          <li key={listing.id}>
            {listing.title}{" "}
            <button onClick={() => handleDeleteListing(listing.id)}>
              Delete a listing!
            </button>
          </li>
        );
      })}
    </ul>
  ) : null;
  if (loading) {
    return <h2>Loading...</h2>;
  }
  if (error) {
    return <h2>Uh oh! Something went wrong - please try again later :(</h2>;
  }
  const deleteListingLoadingMessage = deleteListingLoading ? (
    <h4>Deletion in progress...</h4>
  ) : null;

  const deleteListingErrorMessage = deleteListingError ? (
    <h4>Uh oh! Something went wrong with deleting :(. Please try again soon.</h4>
  ) : null;
  return (
    <div>
      <h2>{title}</h2>
      {listingsList}
      {deleteListingLoadingMessage}
      {deleteListingErrorMessage}
    </div>
  );
};
