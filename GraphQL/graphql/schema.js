const { gql } = require("apollo-server");

const typeDefs = gql`
  type Profile {
    user_id: ID!
    username: String!
    viewedRestaurants: [Restaurant!]!
  }

  type Restaurant {
    restaurant_code: Int!
    name: String!
    place_id: String!
  }

  type Query {
    profiles: [Profile!]!
    profile(user_id: ID!): Profile
    restaurants: [Restaurant!]!
    restaurant(restaurant_code: Int!): Restaurant
  }
`;

module.exports = typeDefs;
