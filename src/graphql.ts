import {GraphQLObjectType, GraphQLString, GraphQLSchema } from "graphql";

const query = new GraphQLObjectType({
  name: "Query",
  // 定义每个字段
  fields: {
    hello: {
      // 标识字段类型
      type: GraphQLString,
      // 命中字段后返回的内容
      resolve: () => "this is [Query] resolver give you Query!"
    }
  }
})

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    hello: {
      type: GraphQLString,
    resolve: () => "this is [Mutation] resolver give you Query!",
    }
  }
})


export const schema = new GraphQLSchema({query,mutation})
