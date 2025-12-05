import { Order, MenuItem, User, Restaurant } from '../models';
import { Context, requireAuth, requireRole } from '../middleware/auth';

interface OrderItemInput {
    menuItemId: string;
    quantity: number;
    specialInstructions?: string;
}

interface CreateOrderInput {
    restaurantId: string;
    items: OrderItemInput[];
    paymentMethod: string;
    addressId: string;
    specialInstructions?: string;
}

const generateOrderNumber = (): string => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `ORD-${timestamp}-${random}`.toUpperCase();
};

export const orderResolvers = {
    Query: {
        orders: async (_: any, { status }: { status?: string }, context: Context) => {
            requireRole(context, ['ADMIN']);
            const filter = status ? { status } : {};
            return await Order.find(filter).sort({ createdAt: -1 });
        },

        order: async (_: any, { id }: { id: string }, context: Context) => {
            requireAuth(context);
            return await Order.findById(id);
        },

        myOrders: async (_: any, __: any, context: Context) => {
            const user = requireAuth(context);
            return await Order.find({ customerId: user.userId }).sort({ createdAt: -1 });
        },

        restaurantOrders: async (
            _: any,
            { restaurantId, status }: { restaurantId: string; status?: string },
            context: Context
        ) => {
            const user = requireRole(context, ['VENDOR']);

            // Verify restaurant ownership
            const restaurant = await Restaurant.findById(restaurantId);
            if (!restaurant || restaurant.ownerId.toString() !== user.userId) {
                throw new Error('Not authorized');
            }

            const filter: any = { restaurantId };
            if (status) filter.status = status;

            return await Order.find(filter).sort({ createdAt: -1 });
        },

        availableDeliveries: async (_: any, __: any, context: Context) => {
            requireRole(context, ['RIDER']);
            return await Order.find({
                status: 'READY_FOR_PICKUP',
                riderId: null
            }).sort({ createdAt: 1 });
        },

        myDeliveries: async (_: any, __: any, context: Context) => {
            const user = requireRole(context, ['RIDER']);
            return await Order.find({ riderId: user.userId }).sort({ createdAt: -1 });
        }
    },

    Mutation: {
        createOrder: async (_: any, { input }: { input: CreateOrderInput }, context: Context) => {
            const user = requireRole(context, ['CUSTOMER']);

            // Get customer's address
            const customer = await User.findById(user.userId);
            if (!customer || !customer.addresses || customer.addresses.length === 0) {
                throw new Error('No delivery address found');
            }

            const address = customer.addresses.find(
                (addr: any) => addr._id.toString() === input.addressId
            );
            if (!address) {
                throw new Error('Address not found');
            }

            // Get restaurant
            const restaurant = await Restaurant.findById(input.restaurantId);
            if (!restaurant) {
                throw new Error('Restaurant not found');
            }

            if (restaurant.status !== 'APPROVED' || !restaurant.isOpen) {
                throw new Error('Restaurant is not available');
            }

            // Calculate order totals
            let subtotal = 0;
            const orderItems = [];

            for (const item of input.items) {
                const menuItem = await MenuItem.findById(item.menuItemId);
                if (!menuItem) {
                    throw new Error(`Menu item ${item.menuItemId} not found`);
                }

                if (!menuItem.isAvailable) {
                    throw new Error(`${menuItem.name} is not available`);
                }

                const itemTotal = menuItem.price * item.quantity;
                subtotal += itemTotal;

                orderItems.push({
                    menuItemId: menuItem._id,
                    name: menuItem.name,
                    price: menuItem.price,
                    quantity: item.quantity,
                    specialInstructions: item.specialInstructions
                });
            }

            // Check minimum order
            if (subtotal < restaurant.minimumOrder) {
                throw new Error(
                    `Minimum order amount is $${restaurant.minimumOrder}. Current total: $${subtotal}`
                );
            }

            const deliveryFee = restaurant.deliveryFee;
            const tax = subtotal * 0.1; // 10% tax
            const total = subtotal + deliveryFee + tax;

            // Calculate estimated delivery time
            const estimatedDeliveryTime = new Date();
            estimatedDeliveryTime.setMinutes(
                estimatedDeliveryTime.getMinutes() + restaurant.estimatedDeliveryTime
            );

            // Create order
            const order = await Order.create({
                orderNumber: generateOrderNumber(),
                customerId: user.userId,
                restaurantId: input.restaurantId,
                items: orderItems,
                subtotal,
                deliveryFee,
                tax,
                total,
                paymentMethod: input.paymentMethod,
                deliveryAddress: {
                    street: address.street,
                    city: address.city,
                    state: address.state,
                    zipCode: address.zipCode,
                    coordinates: address.coordinates
                },
                specialInstructions: input.specialInstructions,
                estimatedDeliveryTime
            });

            return order;
        },

        updateOrderStatus: async (
            _: any,
            { id, status }: { id: string; status: string },
            context: Context
        ) => {
            const user = requireAuth(context);

            const order = await Order.findById(id);
            if (!order) {
                throw new Error('Order not found');
            }

            // Authorization checks based on role
            if (user.role === 'VENDOR') {
                const restaurant = await Restaurant.findById(order.restaurantId);
                if (!restaurant || restaurant.ownerId.toString() !== user.userId) {
                    throw new Error('Not authorized');
                }
            } else if (user.role === 'RIDER') {
                if (order.riderId?.toString() !== user.userId) {
                    throw new Error('Not authorized');
                }
            } else if (user.role !== 'ADMIN') {
                throw new Error('Not authorized');
            }

            const updates: any = { status };

            // Set actual delivery time when delivered
            if (status === 'DELIVERED') {
                updates.actualDeliveryTime = new Date();
                updates.paymentStatus = 'PAID';
            }

            return await Order.findByIdAndUpdate(id, updates, { new: true });
        },

        assignRider: async (
            _: any,
            { orderId, riderId }: { orderId: string; riderId: string },
            context: Context
        ) => {
            requireRole(context, ['ADMIN']);

            const rider = await User.findById(riderId);
            if (!rider || rider.role !== 'RIDER') {
                throw new Error('Invalid rider');
            }

            return await Order.findByIdAndUpdate(
                orderId,
                { riderId, status: 'OUT_FOR_DELIVERY' },
                { new: true }
            );
        },

        acceptDelivery: async (_: any, { orderId }: { orderId: string }, context: Context) => {
            const user = requireRole(context, ['RIDER']);

            const order = await Order.findById(orderId);
            if (!order) {
                throw new Error('Order not found');
            }

            if (order.status !== 'READY_FOR_PICKUP') {
                throw new Error('Order is not ready for pickup');
            }

            if (order.riderId) {
                throw new Error('Order already assigned to a rider');
            }

            return await Order.findByIdAndUpdate(
                orderId,
                { riderId: user.userId, status: 'OUT_FOR_DELIVERY' },
                { new: true }
            );
        },

        cancelOrder: async (
            _: any,
            { id, reason }: { id: string; reason?: string },
            context: Context
        ) => {
            const user = requireAuth(context);

            const order = await Order.findById(id);
            if (!order) {
                throw new Error('Order not found');
            }

            // Customers can only cancel their own pending orders
            if (user.role === 'CUSTOMER') {
                if (order.customerId.toString() !== user.userId) {
                    throw new Error('Not authorized');
                }
                if (order.status !== 'PENDING' && order.status !== 'CONFIRMED') {
                    throw new Error('Order cannot be cancelled at this stage');
                }
            }

            return await Order.findByIdAndUpdate(
                id,
                { status: 'CANCELLED', paymentStatus: 'REFUNDED' },
                { new: true }
            );
        }
    },

    Order: {
        customer: async (parent: any) => {
            return await User.findById(parent.customerId).select('-password');
        },
        restaurant: async (parent: any) => {
            return await Restaurant.findById(parent.restaurantId);
        },
        rider: async (parent: any) => {
            if (!parent.riderId) return null;
            return await User.findById(parent.riderId).select('-password');
        },
        items: async (parent: any) => {
            // Populate menu item details
            const items = await Promise.all(
                parent.items.map(async (item: any) => {
                    const menuItem = await MenuItem.findById(item.menuItemId);
                    return {
                        ...item.toObject(),
                        menuItem
                    };
                })
            );
            return items;
        }
    }
};
