import { gql } from '@apollo/client';

export const CREATE_RESTAURANT = gql`
  mutation CreateRestaurant($input: RestaurantInput!) {
    createRestaurant(input: $input) {
      id
      name
      description
      cuisine
      address {
        street
        city
        state
        zipCode
      }
      phone
      email
      status
      isOpen
    }
  }
`;

export const GET_MY_RESTAURANT = gql`
  query GetMyRestaurant($ownerId: ID!) {
    restaurants(ownerId: $ownerId) {
      id
      name
      description
      logo
      coverImage
      cuisine
      address {
        street
        city
        state
        zipCode
      }
      phone
      email
      status
      rating
      totalReviews
      isOpen
      deliveryFee
      minimumOrder
      estimatedDeliveryTime
    }
  }
`;

export const CREATE_MENU_ITEM = gql`
  mutation CreateMenuItem($restaurantId: ID!, $input: MenuItemInput!) {
    createMenuItem(restaurantId: $restaurantId, input: $input) {
      id
      name
      description
      price
      category
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

export const GET_MENU_ITEMS = gql`
  query GetMenuItems($restaurantId: ID!) {
    menuItems(restaurantId: $restaurantId) {
      id
      name
      description
      price
      category
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

export const GET_VENDOR_STATS = gql`
  query GetVendorStats($restaurantId: ID!) {
    restaurantStats(restaurantId: $restaurantId) {
      totalOrders
      totalRevenue
      averageOrderValue
    }
    restaurantOrders(restaurantId: $restaurantId) {
      id
      orderNumber
      status
      total
      createdAt
      customer {
        firstName
        lastName
      }
      items {
        name
        quantity
      }
    }
  }
`;
