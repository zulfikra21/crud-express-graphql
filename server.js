const express = require("express");
const graphqlHttp = require("graphql-http/lib/use/express");
const graphql = require("graphql");

const query_root = new graphql.GraphQLObjectType({
    name:"Query",
    fields:() => ({
        hello:{
            type: graphql.GraphQLString,
            resolve: () => "Hello world"
        }
    })
})

const schema = new graphql.GraphQLSchema({ query: query_root })

const app = express();

app.all("/api", graphqlHttp.createHandler({
    schema: schema,
    
}))

app.listen(process.env.PORT, () => {
    // console.log(process.env)
    console.log("Server is running on port " + process.env.PORT)
})