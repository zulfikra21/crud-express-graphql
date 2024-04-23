const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const client = new Client({
    host:"localhost",
    user: "cat",
    password:"cat_2023",
    port: 5678,
    database:"graphql"
});

client.connect();

let query = fs.readFileSync(path.resolve(__dirname,"schema.sql")).toString();

client.query(query);
