import { gql } from '@apollo/client';

export const GET_RESTAURANT_WITH_MENU = gql`
  query GetRestaurantWithMenu($id: ID!) {
    restaurant(id: $id) {
      id
      name
      description
      logo
      coverImage
      cuisine
      rating
      totalReviews
      isOpen
      deliveryFee
      minimumOrder
      estimatedDeliveryTime
      address {
        street
        city
        state
        zipCode
        coordinates {
          latitude
          longitude
        }
      }
      phone
      email
    }
    menuItems(restaurantId: $id) {
      id
      name
      description
      category
      price
      image
      isAvailable
      isVegetarian
      isVegan
      isGlutenFree
      spicyLevel
      preparationTime
    }
  }
`;

export const ADD_ADDRESS = gql`
  mutation AddAddress($input: AddressInput!) {
    addAddress(input: $input) {
      id
      addresses {
        id
        label
        street
        city
        state
        zipCode
        isDefault
      }
    }
  }
`;
