import {gql} from '@apollo/client';

export const QUERY_THOUGHTS = gql `
query thoughts($username: String) {
    thoughts(username: $username) {
        _id
        thoughtText
        createdAt
        username
        reactionCount
        reactions {
            _id
            createdAt
            username
            reactionBody
        }
    }
}
`;

//Query for Single Thought ID
export const QUERY_THOUGHT = gql`
  query thought($id: ID!) {
    thought(_id: $id) {
      _id
      thoughtText
      createdAt
      username
      reactionCount
      reactions {
        _id
        createdAt
        username
        reactionBody
      }
    }
  }
`;

//Query for User 
export const QUERY_USER = gql `
    query user($username: String!) {
        user(username: $username) {
            _id
            username
            email
            friendCount
            friends {
                _id
                username
            }
            thoughts {
                _id
                thoughtText
                createdAt
                reactionCount
            }
        }
    }
`;

