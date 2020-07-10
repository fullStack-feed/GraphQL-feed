import {GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLNonNull, GraphQLList, GraphQLID, GraphQLInt, GraphQLFloat } from "graphql";
import {listings} from './listings'
/**
 * 用GraphQL 改写RESTful api风格
 */


// TODO:对每个mock的数据进行类型添加？
const Listing = new GraphQLObjectType({
  name: "Listing",
  fields: {
    // GraphQLNonNull 标识这个字段不能为空  等同于 !
    id: { type: GraphQLNonNull(GraphQLID) },
    title: { type: GraphQLNonNull(GraphQLString) },
    image: { type: GraphQLNonNull(GraphQLString) },
    address: { type: GraphQLNonNull(GraphQLString) },
    price: { type: GraphQLNonNull(GraphQLInt) },
    numOfGuests: { type: GraphQLNonNull(GraphQLInt) },
    numOfBeds: { type: GraphQLNonNull(GraphQLInt) },
    numOfBaths: { type: GraphQLNonNull(GraphQLInt) },
    rating: { type: GraphQLNonNull(GraphQLFloat) }
  }
});


const query = new GraphQLObjectType({
  name: "Query",
  // 定义每个字段
  fields: {
    listings: {
      // 标识字段类型
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(Listing))),
      // 命中字段后返回的内容
      resolve: () => {
        return listings;
      }
    }
  }
})

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    deleteListing: {
      type: GraphQLNonNull(Listing),    
    /**
     * resolve最终的三个参数
     * 
     */
    args: {
      id: { type: GraphQLNonNull(GraphQLID) }
    },
    resolve: (_root,{id}) => {
      for (let i = 0; i < listings.length; i++) {
        if (listings[i].id === id) {
          return listings.splice(i, 1)[0];
        }
      }
      throw new Error("failed to deleted listing");
    },
    }
  }
})


export const schema = new GraphQLSchema({query,mutation})
