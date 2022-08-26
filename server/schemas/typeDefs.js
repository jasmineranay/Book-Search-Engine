const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int 
    savedBooks: [Book]!
  }

  type Book {
    bookId: String
    authors: String
    description: String
    title: String
    image: String
    link: String
  }


  type Auth {
    token: ID!
    user: User
  }

  type Query {
    # GET SINGLE USER
    me(_id: ID!): User

    # GET ALL USERS
    allUsers: [User]

    # UNUSED
    # user(username: String!): User
    # savedBooks(savedBooks: String): [Book] ??
    # book(bookId: ID!): Book ??
  }

  type Mutation {
    # ADD A USER
    addUser(username: String!, email: String!, password: String!): Auth

    # LOGIN
    login(email: String!, password: String!): Auth

    # SAVE A BOOK
    saveBook(authors: [String]!, description: String, title: String!, bookId: String!, image: String!): User

    removeBook(userId: ID!, bookId: String!): Book
  }
`;

module.exports = typeDefs;
