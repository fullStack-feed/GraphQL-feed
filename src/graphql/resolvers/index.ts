import merge from "lodash.merge";
import { listingResolvers } from "./Listing";

// 在这里，就可以添加多个resolvers 从而实现模块化
export const resolvers = merge(listingResolvers);
