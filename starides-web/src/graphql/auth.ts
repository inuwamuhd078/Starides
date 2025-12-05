import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        firstName
        lastName
        role
        avatar
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        email
        firstName
        lastName
        role
        avatar
      }
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      firstName
      lastName
      role
      avatar
      isActive
      isVerified
    }
  }
`;
