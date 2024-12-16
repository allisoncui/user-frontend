const ProfileModel = require("../models/ProfileModel");
const RestaurantModel = require("../models/RestaurantModel");
const ViewedModel = require("../models/ViewedModel");

const resolvers = {
  Query: {
    // Fetch all profiles
    profiles: async () => {
      const profiles = await ProfileModel.getAllProfiles();
      // Include viewedRestaurants for each profile
      return Promise.all(
        profiles.map(async (profile) => {
          const viewedRestaurants = await ViewedModel.getViewedRestaurants(profile.user_id);
          return { ...profile, viewedRestaurants };
        })
      );
    },

    // Fetch a single profile by user_id
    profile: async (_, { user_id }) => {
      const profile = await ProfileModel.getProfileById(user_id);
      if (profile) {
        const viewedRestaurants = await ViewedModel.getViewedRestaurants(user_id);
        return { ...profile, viewedRestaurants };
      }
      return null;
    },

    // Fetch all restaurants
    restaurants: () => RestaurantModel.getAllRestaurants(),

    // Fetch a single restaurant by its code
    restaurant: (_, { restaurant_code }) => RestaurantModel.getRestaurantByCode(restaurant_code),
  },

  Profile: {
    // Resolve viewedRestaurants for a profile
    viewedRestaurants: (parent) => ViewedModel.getViewedRestaurants(parent.user_id),
  },
};

module.exports = resolvers;
