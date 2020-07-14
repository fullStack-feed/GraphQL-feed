## GraphQL是什么？

A spec that describes a declarative query language that your clients can use to ask an API for the exact data they want. This is achieved by creating a strongly typed Schema for your API, ultimate ﬂexibility in how your API can resolve data, and client queries validated against your Schema.

- 一种API查询语言规范
- 强类型
- 要什么给什么

### Server Side

#### Type Deﬁnitions

主要是描述了你的数据的shape，以及对整个Schema进行类型定义。

#### Resolvers

对标 MVC 中的controllers，可以从任何地方索取数据（远程数据库、其他服务器、RESTful 接口以及GraphQL 接口，任何地方都可以）。

#### Query Definitions

规定了如何查寻数据库中的数据

#### Mutation Definitions

规定了对数据的操作，例如增删改。

#### Composition

属于进阶部分的知识，新的概念，按下不表...

#### Schema

API风格的蓝图，定义了你的Query 怎么写， Mutation 怎么写... resolvers...

### Client Side

#### Queries 

客户端查询接口数据

#### Mutations

客户端提交mutation来修改数据

#### Fragments

todo:

## GraphQL fit in ?

- A GraphQL server with a connected DB (most greenﬁelds) （传统面向一个DB的架构）

- A GraphQL server as a layer in front of many 3rd party services and connects them all with one GraphQL API （面向不同集群或者作为中间层的架构）

- A hybrid approach where a GraphQL server has a connected DB and also communicates with 3rd party services （混合架构）

## Comparing Github's REST and GraphQL APIs

### 概念层面上

REST 面向资源的架构，可以通过GET、POST、DELETE 和 PUT等操作来浏览Web资源。

他的缺点有：

- 过量获取
- 获取不足
- 管理REST接口

### 使用层面上

> 这一部分主要是对RESTful API 和 GraphQL API 进行一个使用层面上的对比，示例仓库可以换成自己的进行练习体会。

We'll dive into a good example that showcases GraphQL before we discuss and address some of GraphQL's core concepts.

We're going to use the [Github Public API](https://developer.github.com/) as this lesson's example. GitHub has two versions of its API currently active:

- [v3](https://developer.github.com/v3/) which is the traditional REST API.
- [v4](https://developer.github.com/v4/) which is the new GraphQL API.

To access Github's REST API, we can make requests to the following public URL - <https://api.github.com>. This main parent route gives us an overview of all the different routes we can then interact with in the v3 REST API.

![https://api.github.com](public/assets/github-v3-api.png)

To explore GitHub’s GraphQL API, we can go to <https://developer.github.com/v4/explorer>. For this GraphQL interface to work, we'll need be logged in with a GitHub account.

![https://developer.github.com/v4/explorer](public/assets/github-v4-api-explorer.png)

For our first exercise, the first thing we'd look to do is to get the description of a particular repository with both the v3 and v4 APIs. The repository we'll be using is Github's own [Hello World](https://github.com/octocat/Hello-World) repository, created by the Octocat profile. The description we'll like to fetch for the Hello-World repository is `My first repository on GitHub!`, which can be seen in the UI when we navigate to the repository route in our browser.

![https://github.com/octocat/Hello-World](public/assets/hello-world-desc-ui.png)

### Repository description

#### v4 REST API

When we head to <https://github.com/octocat/Hello-World> in our browser, we're presented with the information of the Hello-World repository in our UI. Github allows us to see the data being returned for this route by hitting the <https://api.github.com/repos/octocat/Hello-World> route. We're making a GET request here as well and the data returned looks as follows:

![https://api.github.com/repos/octocat/Hello-World](public/assets/v3-api-description.png)

Though we've managed to retrieve the `description` field we're looking for in the repository, the server sent us a lot more "useless" (i.e. useless for our current interest) such as the `name` of the repository, details of the `owner` of the repository, and other URLs that can allow us to make other requests to get more information. Regardless, we _have_ to retrieve all this information despite the fact we only want the value of a single field.

#### v3 GraphQL API

Let's contrast this with GraphQL. We'll head over to the GraphQL Explorer GitHub provides for their new API at <https://developer.github.com/v4/explorer>. The first thing that can be noted here is that we're able to interact with an interactive environment to help make GraphQL requests. We'll talk about this a little more in the next lesson, but the capability of using IDEs is a cool feature that many different GraphQL services provide.

![https://developer.github.com/v4/explorer](public/assets/github-v4-api-explorer.png)

> ### Github's GraphQL Explorer deals with live production data
>
> You'll most likely to be able to delete issues, projects, and perhaps even your account. We'll suggest being careful when you use this explorer!

Though we won't be doing too much of a deep dive just yet, we essentially want to make a GET request of sorts to retrieve the description of the Hello-World repository. In GraphQL, we're able to make **queries** to retrieve data that we would want.

If this is the first time launching the GraphQL explorer, there should already be a query set up in allowing us to retrieve the username of our account. `username` lives in the `login` field under `viewer`. If we run our query (by clicking the play button), we can see the login field returns the username of our account - `TinyHouse-Dev`.

![](public/assets/v4-query-username.png)

Let's modify this query and attempt to query the description field from the Hello-World repository.

The `description` field we're interested in lives within a parent `repository` field that takes an argument of the repository that is to be queried. As a result, we'll specify `repository` as the parent field we want to query and we'll pass in the arguments that conform to the Hello-World repository - `owner: "octocat"` and `name: "Hello-World!"`. And we'll only declare a `description` field within to be the field we want data to be returned for.

```graphql
query {
  repository(owner: "octocat", name: "Hello-World") {
    description
  }
}
```

When we run the query, **we get the expected description we're looking for**.

![https://developer.github.com/v4/explorer](public/assets/v4-query-description.png)

Notice how clean this response is as compared to the response being returned from our REST API? **We get only what we ask for**.

### More repository information

For the next exercise, let’s do something a little more complicated. Imagine if we were developing a client app that needs to display the following information from the same Hello-World repository:

- The repository description.
- The title of a certain particular issue in the repository. We'll use [issue #348](https://github.com/octocat/Hello-World/issues/348) of the Hello-World repository.
- The first 5 comments of said issue. For each comment, we'll also like to display the comment author's username and the comment body text

#### v3 REST API

To accomplish this with the REST API, we'll need to make three different requests.

1.  A request to <https://api.github.com/repos/octocat/Hello-World> to get the repository description.
2.  A request to <https://api.github.com/repos/octocat/Hello-World/issues/348> to retrieve the title of [issue #348](https://github.com/octocat/Hello-World/issues/348) of the Hello-World repo.
3.  Finally, another request to <https://api.github.com/repos/octocat/Hello-World/issues/348/comments> to get the 5 (and many more!) comments of [issue #348](https://github.com/octocat/Hello-World/issues/348).

We'll need to make _three_ separate requests to get all the information we might be looking for.

#### v4 GraphQL API

With a well built GraphQL API, this can be made _easier_ from a client perspective. This is, because with GraphQL, we can specify _exactly_ what we need from the client. Let's see how this can work for the above use case and Github's GraphQL API.

- The [`repository` query field](https://developer.github.com/v4/object/repository/) contains an [`issue` field](https://developer.github.com/v4/object/issue/) that allows us to query information about a certain issue in the repository.
- To get information for a certain issue, we're required to specify a `number` argument where we can provide the issue number.
- The `issue` field contains a child [`comments` field](https://developer.github.com/v4/interface/comment/) where comments of an issue can be queried.
- `comments` in `issue` is a paginated field so we're able to query the first five by specifying a `first` argument with a value of `5`.
- Pagination in `comments` follows a [relay-based pattern](https://facebook.github.io/relay/graphql/connections.htm) (something we'll talk more about in part 2 of this course) but essentially the data we're looking for lives within `edges` and then `nodes`. For every comment we want to query, we're interested in receiving the `bodyText` of the comment and the username of the commenter which lives under the `author.logIn` field.

With all that said, the query we'd like to make looks like the following.

```graphql
query {
  repository(owner: "octocat", name: "Hello-World") {
    description
    issue(number: 348) {
      title
      comments(first: 5) {
        edges {
          node {
            bodyText
            author {
              login
            }
          }
        }
      }
    }
  }
}
```

When we run the query, we get _exactly_ what we requested.

![https://developer.github.com/v4/explorer](public/assets/v4-query-repository-details.png)

Amazing! This is a great example of a significant advantage of using GraphQL. **GraphQL APIs allow clients to ask for exactly what they need and nothing more**.

There's a lot of information we've glazed over such as how we're making our queries, what are fields and the type definitions of each field, where mutations fall in the picture, and a lot more. Throughout the course, we'll be introducing all these concepts starting with the next lesson where we take a little deeper of a dive into GraphQL's core concepts.

## Basic parts

- Types - a construct deﬁning a shape with ﬁelds

- Fields - keys on a Type that have a name and a value type

- Scalars - primitive value type built into GraphQL

- Query - type that deﬁnes how clients can access data

- Mutation- type that deﬁnes how clients can modify or create data

### What is a Query?

A Type on a Schema that deﬁnes operations clients can perform to access data that resembles the shape of the other Types in the Schema.

> 只关注这个数据的shape，不需要考虑其他的事情。

#### Creating Queries

- Create Query Type in the Schema using SDL

- Add ﬁelds to the Query Type

- Create Resolvers that for the ﬁelds

### What are Resolvers?

Functions that are responsible for returning values for ﬁelds that exist on Types in a Schema. Resolvers execution is dependent on the incoming client Query.

> 不太明白老师说的 GraphQL 只有一个 endpoint 指的是什么

#### Creating Resolvers

- Resolver names must match the exact ﬁeld name on your Schema’s Types

- Resolvers must return the value type declared for the matching ﬁeld

- Resolvers can be async

- Can retrieve data from any source


### Arguments and Input Types

#### Arguments

- Allows clients to pass variables along with Queries that can be used in your Resolvers to get data

- Must be deﬁned in your Schema

- Can be added to any ﬁeld

- Either have to be Scalars or Input Types

#### Input Type

- Just like Types, but used for Arguments
- All ﬁeld value types must be other Input Types or Scalar

> 只是用于 arguments 的 类型，语义化更强一些而已。

#### Arguments in Resolvers

- Arguments will be passed to ﬁeld Resolvers as the second argument
- The argument object will strictly follow the argument names and ﬁeld types
- Do whatever you want with them

### What are Mutations?

A Type on a Schema that deﬁnes operations clients can perform to mutate data (create, update, delete).

#### Creating Mutations

- Deﬁne Mutation Type on Schema using SDL
- Add ﬁelds for Mutation type
- Add arguments for Mutation ﬁelds
- Create Resolvers for Mutation ﬁelds

#### Return values for Mutation ﬁelds

- Dependent on your clients and use case
- If using a client side GraphQL cache, you should return the exact values Queries return

### Advanced SDL

#### Enums

A set of discrete values that can be used in place of Scalars. An enum ﬁeld must resolve to one of the values in the Enum. Great for limiting a ﬁeld to only a few different options.

#### Interfaces

Abstract Types that can’t be used as ﬁeld values but instead used as foundations for explicit Types. Great for when you have Types that share common ﬁelds, but differ slightly.

#### Unions

Like interfaces, but without any deﬁned common ﬁelds amongst the Types. Useful when you need to access more than one disjoint Type from one Query, like a search.

### Relationships

#### Thinking in Graphs

Your API is no longer a predeﬁned list of operations that always return the same shapes. Instead, your API is a set of Nodes that know how to resolve themselves and have links to other Nodes. This allows a client to ask for Nodes and then follow those links to get related Nodes.

#### Adding Relationships

- Add a Type as a ﬁeld value on another Type
- Create resolvers for those ﬁelds on the Type

## GraphQL in Client
