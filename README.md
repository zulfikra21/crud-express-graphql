# CRUD GraphQL

## Overview

This project is an example how to run graphql and node.js(express.js)

## Prerequisites

- Node.js 18 or latest
- npm
- PostgreSQL

## Installation

1. Rename the `.env-example` file to `.env`.
2. Adjust the content in the `.env` file according to your database configuration.
3. Run `npm install` to install the depedencies
3. Run `npm run migrate` to set up the database schema.
4. Run `npm run dev` to start the application in development mode.

## Usage

The application provides a GraphQL operation 

## GraphQL Schema

### Types

#### Player
- **id**: ID!
- **first_name**: String!
- **last_name**: String!
- **team_id**: Int!

#### Team
- **id**: ID!
- **name**: String!

### Queries

#### player
- **Arguments**: first_name: String!, last_name: String!, team_id: Int!
- **Return Type**: Player

#### team
- **Arguments**: name: String!
- **Return Type**: Team

### Mutations

#### addPlayer
- **Arguments**: first_name: String!, last_name: String!, team_id: Int!
- **Return Type**: Player

#### addTeam
- **Arguments**: name: String!
- **Return Type**: Team
## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License



Feel free to customize this template according to your specific code and project requirements.

Let me know
