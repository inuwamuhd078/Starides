import { MenuItem, Restaurant } from '../models';
import { Context, requireRole } from '../middleware/auth';

interface MenuItemInput {
    name: string;
    description: string;
    category: string;
    price: number;
    isVegetarian?: boolean;
    isVegan?: boolean;
    isGlutenFree?: boolean;
    spicyLevel?: number;
    preparationTime: number;
    calories?: number;
    ingredients?: string[];
    allergens?: string[];
}

export const menuItemResolvers = {
    Query: {
        menuItems: async (_: any, { restaurantId }: { restaurantId: string }) => {
            return await MenuItem.find({ restaurantId });
        },

        menuItem: async (_: any, { id }: { id: string }) => {
            return await MenuItem.findById(id);
        }
    },

    Mutation: {
        createMenuItem: async (
            _: any,
            { restaurantId, input }: { restaurantId: string; input: MenuItemInput },
            context: Context
        ) => {
            const user = requireRole(context, ['VENDOR']);

            // Verify restaurant ownership
            const restaurant = await Restaurant.findById(restaurantId);
            if (!restaurant) {
                throw new Error('Restaurant not found');
            }

            if (restaurant.ownerId.toString() !== user.userId) {
                throw new Error('Not authorized');
            }

            return await MenuItem.create({
                restaurantId,
                ...input,
                ingredients: input.ingredients || [],
                allergens: input.allergens || []
            });
        },

        updateMenuItem: async (
            _: any,
            { id, input }: { id: string; input: MenuItemInput },
            context: Context
        ) => {
            const user = requireRole(context, ['VENDOR']);

            const menuItem = await MenuItem.findById(id);
            if (!menuItem) {
                throw new Error('Menu item not found');
            }

            // Verify restaurant ownership
            const restaurant = await Restaurant.findById(menuItem.restaurantId);
            if (!restaurant || restaurant.ownerId.toString() !== user.userId) {
                throw new Error('Not authorized');
            }

            return await MenuItem.findByIdAndUpdate(id, input, { new: true });
        },

        deleteMenuItem: async (_: any, { id }: { id: string }, context: Context) => {
            const user = requireRole(context, ['VENDOR']);

            const menuItem = await MenuItem.findById(id);
            if (!menuItem) {
                throw new Error('Menu item not found');
            }

            // Verify restaurant ownership
            const restaurant = await Restaurant.findById(menuItem.restaurantId);
            if (!restaurant || restaurant.ownerId.toString() !== user.userId) {
                throw new Error('Not authorized');
            }

            await MenuItem.findByIdAndDelete(id);
            return true;
        },

        toggleMenuItemAvailability: async (_: any, { id }: { id: string }, context: Context) => {
            const user = requireRole(context, ['VENDOR']);

            const menuItem = await MenuItem.findById(id);
            if (!menuItem) {
                throw new Error('Menu item not found');
            }

            // Verify restaurant ownership
            const restaurant = await Restaurant.findById(menuItem.restaurantId);
            if (!restaurant || restaurant.ownerId.toString() !== user.userId) {
                throw new Error('Not authorized');
            }

            return await MenuItem.findByIdAndUpdate(
                id,
                { isAvailable: !menuItem.isAvailable },
                { new: true }
            );
        }
    },

    MenuItem: {
        restaurant: async (parent: any) => {
            return await Restaurant.findById(parent.restaurantId);
        }
    }
};
