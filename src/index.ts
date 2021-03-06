require("dotenv").config();
import { connectDatabase } from "./database/index";
import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./graphql";

const app = express();

/**
 * 高阶函数，接受一个express实例
 *
 * 目的：将复杂逻辑收敛到一个函数中
 *
 * - 连接数据库
 * - 启动apolloServer
 * -
 * @param app
 *
 */
const mount = async (app: Application) => {
  const db = await connectDatabase();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({ db }),
  });
  server.applyMiddleware({ app, path: "/api" });
  const listings = await db.listings.find({}).toArray();
  console.log(listings);
  app.listen(process.env.PORT);
};

mount(express());
