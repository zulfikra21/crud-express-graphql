const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const { DATABASE_USER, DATABASE_PASSWORD, DATABASE, DATABASE_HOST, DATABASE_PORT } = process.env

const client = new Client({
    host:DATABASE_HOST,
    user: DATABASE_USER,
    password:DATABASE_PASSWORD,
    port: DATABASE_PORT,
    database:DATABASE
});

client.connect();

let query = fs.readFileSync(path.resolve(__dirname,"schema.sql")).toString();

(() => {
    try {
        client.query(query);
        console.log("success to migrate!!")
        process.exit(1)
    } catch (error) {
        console.error(error)
        console.log("failed to migration")    
    }
})()
