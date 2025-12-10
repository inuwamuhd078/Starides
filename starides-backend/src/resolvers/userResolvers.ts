import { User } from '../models';
import { Context, requireAuth, requireRole } from '../middleware/auth';

export interface AddressInput {
    label: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    latitude: number;
    longitude: number;
    isDefault?: boolean;
}

export const userResolvers = {
    Query: {
        users: async (_: any, { role }: { role?: string }, context: Context) => {
            requireRole(context, ['ADMIN']);
            const filter = role ? { role } : {};
            return await User.find(filter).select('-password');
        },

        user: async (_: any, { id }: { id: string }, context: Context) => {
            requireAuth(context);
            return await User.findById(id).select('-password');
        }
    },

    Mutation: {
        updateProfile: async (
            _: any,
            { firstName, lastName, phone, avatar }: any,
            context: Context
        ) => {
            const user = requireAuth(context);
            const updates: any = {};

            if (firstName) updates.firstName = firstName;
            if (lastName) updates.lastName = lastName;
            if (phone) updates.phone = phone;
            if (avatar) updates.avatar = avatar;

            return await User.findByIdAndUpdate(
                user.userId,
                updates,
                { new: true }
            ).select('-password');
        },

        addAddress: async (_: any, { input }: { input: AddressInput }, context: Context) => {
            const user = requireAuth(context);

            const address = {
                label: input.label,
                street: input.street,
                city: input.city,
                state: input.state,
                zipCode: input.zipCode,
                coordinates: {
                    latitude: input.latitude,
                    longitude: input.longitude
                },
                isDefault: input.isDefault || false
            };

            // If this is the default address, unset other defaults
            if (address.isDefault) {
                await User.updateOne(
                    { _id: user.userId },
                    { $set: { 'addresses.$[].isDefault': false } }
                );
            }

            return await User.findByIdAndUpdate(
                user.userId,
                { $push: { addresses: address } },
                { new: true }
            ).select('-password');
        },

        updateRiderAvailability: async (
            _: any,
            { isAvailable }: { isAvailable: boolean },
            context: Context
        ) => {
            const user = requireRole(context, ['RIDER']);

            return await User.findByIdAndUpdate(
                user.userId,
                { isAvailable },
                { new: true }
            ).select('-password');
        }
    },

    User: {
        restaurant: async (parent: any) => {
            if (!parent.restaurantId) return null;
            const { Restaurant } = await import('../models');
            return await Restaurant.findById(parent.restaurantId);
        }
    }
};
