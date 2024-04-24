const express = require("express");
const graphqlHttp = require("graphql-http/lib/use/express");
const graphql = require("graphql");
const joinMonster = require('join-monster')
const { Client } = require("pg");

const { DATABASE_USER, DATABASE_PASSWORD, DATABASE, DATABASE_HOST, DATABASE_PORT } = process.env

const client = new Client({
    host:DATABASE_HOST,
    user: DATABASE_USER,
    password:DATABASE_PASSWORD,
    port: DATABASE_PORT,
    database:DATABASE
});

client.connect();
// inital hello world

const { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList } = graphql

const Player = new GraphQLObjectType({
    name: "Player",
    fields: () => ({
        id: { type: GraphQLString },
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        team: {
            type: Team,
            sqlJoin: (playerTable, teamTable, args) => `${playerTable}.team_id = ${teamTable}.id`
        }
    })
})

Player._typeConfig = {
    sqlTable: 'player',
    uniqueKey: 'id',
}

const Team = new graphql.GraphQLObjectType({
    name: 'Team',
    fields: () => ({
        id: { type: graphql.GraphQLInt },
        name: { type: graphql.GraphQLString },
        players: {
            type: new GraphQLList(Player),
            sqlJoin: (teamTable, playerTable, args) => `${teamTable}.id = ${playerTable}.team_id`
        }
    })
})

Team._typeConfig = {
    sqlTable: 'team',
    uniqueKey: 'id'
}

const query_root = new graphql.GraphQLObjectType({
    name: "Query",
    fields: () => ({
        hello: {
            type: GraphQLString,
            resolve: () => {
                "Hello world"
            }
        },
        players: {
            type: new graphql.GraphQLList(Player),
            resolve: (parents, args, context, resolveInfo) => {
                return joinMonster.default(resolveInfo, {}, sql => {
                    return client.query(sql)
                })
            }
        },
        player: {
            type: Player,
            args: { id: { type: new GraphQLNonNull(graphql.GraphQLInt) } },
            where: (playerTable, args, context) => `${playerTable}.id = ${args.id}`,
            resolve: (parent, args, context, resolveInfo) => {
              return joinMonster.default(resolveInfo, {}, sql => {
                return client.query(sql)
              })
           }
        }
    })
})

const mutation_root = new graphql.GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      player: {
        type: Player,
        args: {
          first_name: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
          last_name: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
          team_id: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) },
        },
        resolve: async (parent, args, context, resolveInfo) => {
          try {
            return (await client.query("INSERT INTO player (first_name, last_name, team_id) VALUES ($1, $2, $3) RETURNING *", [args.first_name, args.last_name, args.team_id])).rows[0]
          } catch (err) {
            console.log(err)
            throw new Error("Failed to insert new player")
          }
        }
      },
      team: {
        type: Team,
        args: {
          name: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
         
        },
        resolve: async (parent, args, context, resolveInfo) => {
            try {
                return (await client.query("INSERT INTO team (name) VALUES ($1) RETURNING *", [args.name])).rows[0]
              } catch (err) {
                console.log(err)
                throw new Error("Failed to insert new player")
              }
          }
      }
    })
  })


// Graph Schema

const schema = new graphql.GraphQLSchema({ query: query_root, mutation: mutation_root })


// Express app
const app = express();

app.all("/api", graphqlHttp.createHandler({
    schema: schema,
}))

// Listen the app
app.listen(process.env.PORT, () => {
    // console.log(process.env)
    console.log("Server is running on port " + process.env.PORT)
})