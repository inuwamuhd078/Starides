import { Order, User, Restaurant } from '../models';
import { Context, requireRole } from '../middleware/auth';

export const statsResolvers = {
    Query: {
        adminStats: async (_: any, __: any, context: Context) => {
            requireRole(context, ['ADMIN']);

            const totalOrders = await Order.countDocuments({ status: 'DELIVERED' });
            const orders = await Order.find({ status: 'DELIVERED' });
            const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
            const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
            const totalCustomers = await User.countDocuments({ role: 'CUSTOMER' });

            return {
                totalOrders,
                totalRevenue,
                averageOrderValue,
                totalCustomers
            };
        },

        restaurantStats: async (
            _: any,
            { restaurantId }: { restaurantId: string },
            context: Context
        ) => {
            const user = requireRole(context, ['VENDOR', 'ADMIN']);

            // Verify restaurant ownership for vendors
            if (user.role === 'VENDOR') {
                const restaurant = await Restaurant.findById(restaurantId);
                if (!restaurant || restaurant.ownerId.toString() !== user.userId) {
                    throw new Error('Not authorized');
                }
            }

            const totalOrders = await Order.countDocuments({
                restaurantId,
                status: 'DELIVERED'
            });
            const orders = await Order.find({ restaurantId, status: 'DELIVERED' });
            const totalRevenue = orders.reduce((sum, order) => sum + order.subtotal, 0);
            const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

            // Get unique customers
            const uniqueCustomers = new Set(orders.map((order) => order.customerId.toString()));
            const totalCustomers = uniqueCustomers.size;

            return {
                totalOrders,
                totalRevenue,
                averageOrderValue,
                totalCustomers
            };
        }
    }
};
