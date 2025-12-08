import { authResolvers } from './authResolvers';
import { userResolvers } from './userResolvers';
import { restaurantResolvers } from './restaurantResolvers';
import { menuItemResolvers } from './menuItemResolvers';
import { orderResolvers } from './orderResolvers';
import { reviewResolvers } from './reviewResolvers';
import { statsResolvers } from './statsResolvers';
import { passwordResetResolvers } from './passwordResetResolvers';

export const resolvers = {
    Query: {
        ...authResolvers.Query,
        ...userResolvers.Query,
        ...restaurantResolvers.Query,
        ...menuItemResolvers.Query,
        ...orderResolvers.Query,
        ...reviewResolvers.Query,
        ...statsResolvers.Query
    },
    Mutation: {
        ...authResolvers.Mutation,
        ...passwordResetResolvers.Mutation,
        ...userResolvers.Mutation,
        ...restaurantResolvers.Mutation,
        ...menuItemResolvers.Mutation,
        ...orderResolvers.Mutation,
        ...reviewResolvers.Mutation
    },
    User: userResolvers.User,
    Restaurant: restaurantResolvers.Restaurant,
    MenuItem: menuItemResolvers.MenuItem,
    Order: orderResolvers.Order,
    Review: reviewResolvers.Review
};
