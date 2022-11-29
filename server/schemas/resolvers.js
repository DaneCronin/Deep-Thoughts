
//Import Mongoose Models
const { User, Thought } = require('../models');
const {AuthenticationError} = require('apollo-server-express');
const { signToken } = require('../utils/auth');


const resolvers = {
    Query: {
        //Me method for JsonWebTokens
        me: async (parent, args) => {
            if(context.user) {
            const userData = await User.findOne({})
            .select('-__v -password')
            .populate('thoughts')
            .populate('friends');

            return userData;
            }
            //if no context.user exists throw new error
            throw new AuthenticationError('Not logged in')
        },
        //Get all thoughts by username or without username
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
    },

    Mutation: {
        //Add User logic 
        addUser: async (parent, args) => {
            const user = await User.create(args);
            //mutation needs to sign token and return object that combines token with user's data
            const token = signToken(user);

            return {token, user};

        },

        //User Login logic
        login: async (parent, {email, password}) => {
            const user = await User.findOne({email});

            if(!user) {
                throw new AuthenticationError('Incorrect username or password');
            }

            const correctPw = await user.isCorrectPassword(password);

            if(!correctPw) {
                throw new AuthenticationError('Incorrect username or password');
            }
           
            const token = signToken(user);
            return {token,user};
        },

        //Add Thought logic
        addThought: async (parent, args, context) => {
            if(context.user) {
                const thought = await Thought.create({...args, username: context.user.username });

                await User.findByIdAndUpdate(
                    {_id: context.user._id},
                    {$push: {thoughts: thought._id}},
                    {new: true}
                );
            }
            throw new AuthenticationError('You need to be logged in!');
        },

        //Add Reaction logic
        addReaction: async (parent, args, context) => {
            if(context.user) {
                const updatedThought = await Thought.findOneAndUpdate(
                    {_id: thoughtId},
                    {$push: {reactions: {reactionBody, username: context.user.username}}},
                    {new: true, runValidators: true}
                );
                return updatedThought;
            }

            throw new AuthenticationError('You need to be logged in!');
        },

        //Add Friend logic
        addFriend: async (parent, {friendId}, context) => {
            if(context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$addToSet: {friends: friendId}},
                    {new: true}
                )
                .populate('friends');

                return updatedUser;
            }

            throw new AuthenticationError('You need to be logged in!');
        }

    }
};

module.exports = resolvers; 