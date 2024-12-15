const ProfileModel = require("../models/ProfileModel");
const RestaurantModel = require("../models/RestaurantModel");
const ViewedModel = require("../models/ViewedModel");

const resolvers = {
  Query: {
    profiles: () => ProfileModel.getAllProfiles(),
    profile: (_, { user_id }) => ProfileModel.getProfileById(user_id),
    restaurants: () => RestaurantModel.getAllRestaurants(),
    restaurant: (_, { restaurant_code }) => RestaurantModel.getRestaurantByCode(restaurant_code),
  },
  Profile: {
    viewedRestaurants: (parent) => ViewedModel.getViewedRestaurants(parent.user_id),
  },
};

module.exports = resolvers;
