// IMPORT USER MODEL AND AUTH
const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');


const resolvers = {
  Query: {
    // GET ALL USERS
    allUsers: async () => {
      return await User.find({});
    },
    // GET SINGLE USER ME
    me: async (parent, args) => {
      return await User.findById(args._id);
    },

  },
  Mutation: {
    // CREATE USER
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);

      return { token, user };
    },
    // USER LOGIN
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No User with this email found!');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect password!');
      }

      const token = signToken(user);
      return { token, user };
    },

    // SAVE BOOK TO USER
    saveBook: async (parent, { authors, description, bookId, image, title }, context) => {
      try {
        if (!context.user) throw new AuthenticationError('You need to be logged in!');

        const { savedBooks } = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: { authors, description, bookId, image, title } } },
          { new: true, runValidators: true }
        );
        return savedBooks
      } catch (err) {
        console.log(err);
        return err;
      }
    },
    // REMOVE BOOK FROM 'savedBooks'
    removeBook: async (parent, { userId, bookId }) => {
      return Profile.findOneAndUpdate(
        { _id: userId },
        { $pull: { savedBooks: bookId } },
        { new: true }
      );
    },
  },
};

module.exports = resolvers;

  // const resolvers = {
  //   Query: {
  //     tech: async () => {
  //       return Tech.find({});
  //     },
  //     matchups: async (parent, { _id }) => {
  //       const params = _id ? { _id } : {};
  //       return Matchup.find(params);
  //     },
  //   },
  //   Mutation: {
  //     createMatchup: async (parent, args) => {
  //       const matchup = await Matchup.create(args);
  //       return matchup;
  //     },
  //     createVote: async (parent, { _id, techNum }) => {
  //       const vote = await Matchup.findOneAndUpdate(
  //         { _id },
  //         { $inc: { [`tech${techNum}_votes`]: 1 } },
  //         { new: true }
  //       );
  //       return vote;
  //     },
  //   },
// };

