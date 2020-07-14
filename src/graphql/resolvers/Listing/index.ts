import { Database, Listing } from "../../../lib/types";
import { IResolvers } from "apollo-server-express";
import { ObjectID } from "mongodb";
export const listingResolvers: IResolvers = {
  Query: {
    listings: async (
      _root: undefined,
      _args: {},
      { db }: { db: Database }
    ): Promise<Listing[]> => {
      return await db.listings.find({}).toArray();
    },
  },
  Mutation: {
    deleteListing: async (
      _root: undefined,
      { id }: { id: string },
      { db }: { db: Database }
    ): Promise<Listing> => {
      const deleteRes = await db.listings.findOneAndDelete({
        _id: new ObjectID(id),
      });
      if (!deleteRes.value) throw new Error("删除数据出错");
      return deleteRes.value;
    },
  },
  // TODO: 为什么要加这个reslovers？
  // 是因为每个Query 和 Mutation 都需要 Listing 这个type ？
  Listing: {
    id: (listing: Listing): string => listing._id.toString(),
  },
};
