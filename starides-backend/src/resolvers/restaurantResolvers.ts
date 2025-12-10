import { Restaurant, User } from '../models';
import { Context, requireAuth, requireRole } from '../middleware/auth';

export interface RestaurantInput {
    name: string;
    description: string;
    cuisine: string[];
    street: string;
    city: string;
    state: string;
    zipCode: string;
    latitude: number;
    longitude: number;
    phone: string;
    email: string;
    deliveryFee: number;
    minimumOrder: number;
    estimatedDeliveryTime: number;
}

export const restaurantResolvers = {
    Query: {
        restaurants: async (_: any, { status, ownerId }: { status?: string; ownerId?: string }) => {
            const filter: any = {};
            if (status) filter.status = status;
            if (ownerId) filter.ownerId = ownerId;
            return await Restaurant.find(filter);
        },

        restaurant: async (_: any, { id }: { id: string }) => {
            return await Restaurant.findById(id);
        },

        nearbyRestaurants: async (
            _: any,
            { latitude, longitude, radius = 10 }: { latitude: number; longitude: number; radius?: number }
        ) => {
            // Find restaurants within radius (in kilometers)
            return await Restaurant.find({
                status: 'APPROVED',
                'address.coordinates': {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [longitude, latitude]
                        },
                        $maxDistance: radius * 1000 // Convert km to meters
                    }
                }
            });
        }
    },

    Mutation: {
        createRestaurant: async (_: any, { input }: { input: RestaurantInput }, context: Context) => {
            const user = requireRole(context, ['VENDOR']);

            // Check if vendor already has a restaurant
            const existingRestaurant = await Restaurant.findOne({ ownerId: user.userId });
            if (existingRestaurant) {
                throw new Error('You already have a restaurant registered');
            }

            const restaurant = await Restaurant.create({
                name: input.name,
                description: input.description,
                ownerId: user.userId,
                cuisine: input.cuisine,
                address: {
                    street: input.street,
                    city: input.city,
                    state: input.state,
                    zipCode: input.zipCode,
                    coordinates: {
                        latitude: input.latitude,
                        longitude: input.longitude
                    }
                },
                phone: input.phone,
                email: input.email,
                deliveryFee: input.deliveryFee,
                minimumOrder: input.minimumOrder,
                estimatedDeliveryTime: input.estimatedDeliveryTime,
                openingHours: []
            });

            // Update user's restaurantId
            await User.findByIdAndUpdate(user.userId, { restaurantId: restaurant._id });

            return restaurant;
        },

        updateRestaurant: async (
            _: any,
            { id, input }: { id: string; input: RestaurantInput },
            context: Context
        ) => {
            const user = requireRole(context, ['VENDOR', 'ADMIN']);

            const restaurant = await Restaurant.findById(id);
            if (!restaurant) {
                throw new Error('Restaurant not found');
            }

            // Vendors can only update their own restaurant
            if (user.role === 'VENDOR' && restaurant.ownerId.toString() !== user.userId) {
                throw new Error('Not authorized');
            }

            const updates: any = {
                name: input.name,
                description: input.description,
                cuisine: input.cuisine,
                address: {
                    street: input.street,
                    city: input.city,
                    state: input.state,
                    zipCode: input.zipCode,
                    coordinates: {
                        latitude: input.latitude,
                        longitude: input.longitude
                    }
                },
                phone: input.phone,
                email: input.email,
                deliveryFee: input.deliveryFee,
                minimumOrder: input.minimumOrder,
                estimatedDeliveryTime: input.estimatedDeliveryTime
            };

            return await Restaurant.findByIdAndUpdate(id, updates, { new: true });
        },

        updateRestaurantStatus: async (
            _: any,
            { id, status }: { id: string; status: string },
            context: Context
        ) => {
            requireRole(context, ['ADMIN']);
            return await Restaurant.findByIdAndUpdate(id, { status }, { new: true });
        },

        toggleRestaurantOpen: async (_: any, { id }: { id: string }, context: Context) => {
            const user = requireRole(context, ['VENDOR']);

            const restaurant = await Restaurant.findById(id);
            if (!restaurant) {
                throw new Error('Restaurant not found');
            }

            if (restaurant.ownerId.toString() !== user.userId) {
                throw new Error('Not authorized');
            }

            return await Restaurant.findByIdAndUpdate(
                id,
                { isOpen: !restaurant.isOpen },
                { new: true }
            );
        }
    },

    Restaurant: {
        owner: async (parent: any) => {
            return await User.findById(parent.ownerId).select('-password');
        },
        menuItems: async (parent: any) => {
            const { MenuItem } = await import('../models');
            return await MenuItem.find({ restaurantId: parent._id });
        }
    }
};
