import { gql } from '@apollo/client';

export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      orderNumber
      total
      status
      estimatedDeliveryTime
    }
  }
`;

export const GET_MY_ORDERS = gql`
  query GetMyOrders {
    myOrders {
      id
      orderNumber
      status
      total
      createdAt
      estimatedDeliveryTime
      restaurant {
        id
        name
        logo
      }
      items {
        name
        quantity
        price
      }
    }
  }
`;

export const GET_ORDER = gql`
  query GetOrder($id: ID!) {
    order(id: $id) {
      id
      orderNumber
      status
      total
      subtotal
      deliveryFee
      tax
      paymentMethod
      paymentStatus
      createdAt
      estimatedDeliveryTime
      actualDeliveryTime
      specialInstructions
      restaurant {
        id
        name
        phone
        address {
          street
          city
          state
        }
      }
      items {
        menuItemId
        name
        price
        quantity
        specialInstructions
      }
      deliveryAddress {
        street
        city
        state
        zipCode
      }
    }
  }
`;
