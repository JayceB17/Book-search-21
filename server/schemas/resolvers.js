const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { Error } = require('../utils/auth');

const resolvers = {
    Query: {
        // me, gets your logged in data
    me: async (context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id }).select('-_v-password');
                return userData;
            }
            throw new Error('Not logged in');
        }

    },
    Mutation: {
        // addUser, adds a new user to the database
        addUser: async (args) => {
            const user =await user.create(args);
            const token = signToken(user);
            return { token, user };
        },

            // Handles your login
        login: async ({ email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('Incorrect email and password'); 
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new Error('Incorrect Password')
            }

            const token = signToken(user);
            return { token, user };
        },
         
        //saveBook, saves a book for you
        saveBook: async ({ input }, context) => {
           if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
                {_id: context.user._id },
                {$addToSet: { savedBoods: input } },
                {new: true, runValidators: true }
            );
            return updatedUser;
           } 
           throw new Error('Please login!');
        },

        //removeBook, removes a saved book
        removeBook: async ({ bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    {_id: context.user._id },
                    {$pull: { savedBooks: { bookId: bookId } } },
                    { new: true, runValidators: true }
                );
                return updatedUser;
            }
            throw new Error('Please login!');
        }
    }
}

module.exports = resolvers;