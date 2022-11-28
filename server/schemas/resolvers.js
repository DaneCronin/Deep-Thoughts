
//Import Mongoose Models
const { User, Thought } = require('../models');


const resolvers = {
    Query: {
        //Get all thoughts
        thoughts: async (parent, {username}) => {
            const params = username ? {username} : {};
            return Thought.find(params).sort({createdAt: -1});
        },
//Get Thought by ID
        thought: async (parent, {_id}) => {
            return Thought.findOne({_id});
        },
//Get All users
        users: async () => {
            return User.find()
            //omit Mongoose specific __v property and the password
            .select('-__v -password')
            //populate withe friends and thoughts data to get any associated data in return
            .populate('friends')
            .populate('thoughts');
        },
        //Get a user by username
        user: async (parent, {username}) => {
            return User.findOne({username})
            .select('-__v -password')
            .populate('friends')
            .populate('thoughts');
        },

    }
};

module.exports = resolvers; 