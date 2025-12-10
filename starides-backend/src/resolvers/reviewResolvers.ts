import { Review, Order, User, Restaurant } from '../models';
import { Context, requireAuth, requireRole } from '../middleware/auth';

export interface ReviewInput {
    orderId: string;
    restaurantRating: number;
    riderRating?: number;
    foodQuality: number;
    deliverySpeed: number;
    comment?: string;
}

export const reviewResolvers = {
    Query: {
        reviews: async (_: any, { restaurantId }: { restaurantId: string }) => {
            return await Review.find({ restaurantId }).sort({ createdAt: -1 });
        },

        review: async (_: any, { id }: { id: string }) => {
            return await Review.findById(id);
        }
    },

    Mutation: {
        createReview: async (_: any, { input }: { input: ReviewInput }, context: Context) => {
            const user = requireRole(context, ['CUSTOMER']);

            // Verify order exists and belongs to customer
            const order = await Order.findById(input.orderId);
            if (!order) {
                throw new Error('Order not found');
            }

            if (order.customerId.toString() !== user.userId) {
                throw new Error('Not authorized');
            }

            if (order.status !== 'DELIVERED') {
                throw new Error('Can only review delivered orders');
            }

            // Check if review already exists
            const existingReview = await Review.findOne({ orderId: input.orderId });
            if (existingReview) {
                throw new Error('Review already exists for this order');
            }

            // Create review
            const review = await Review.create({
                orderId: input.orderId,
                customerId: user.userId,
                restaurantId: order.restaurantId,
                riderId: order.riderId,
                restaurantRating: input.restaurantRating,
                riderRating: input.riderRating,
                foodQuality: input.foodQuality,
                deliverySpeed: input.deliverySpeed,
                comment: input.comment
            });

            // Update restaurant rating
            const reviews = await Review.find({ restaurantId: order.restaurantId });
            const avgRating =
                reviews.reduce((sum, r) => sum + r.restaurantRating, 0) / reviews.length;

            await Restaurant.findByIdAndUpdate(order.restaurantId, {
                rating: avgRating,
                totalReviews: reviews.length
            });

            return review;
        },

        respondToReview: async (
            _: any,
            { reviewId, response }: { reviewId: string; response: string },
            context: Context
        ) => {
            const user = requireRole(context, ['VENDOR']);

            const review = await Review.findById(reviewId);
            if (!review) {
                throw new Error('Review not found');
            }

            // Verify restaurant ownership
            const restaurant = await Restaurant.findById(review.restaurantId);
            if (!restaurant || restaurant.ownerId.toString() !== user.userId) {
                throw new Error('Not authorized');
            }

            return await Review.findByIdAndUpdate(
                reviewId,
                {
                    response: {
                        text: response,
                        respondedAt: new Date()
                    }
                },
                { new: true }
            );
        }
    },

    Review: {
        order: async (parent: any) => {
            return await Order.findById(parent.orderId);
        },
        customer: async (parent: any) => {
            return await User.findById(parent.customerId).select('-password');
        },
        restaurant: async (parent: any) => {
            return await Restaurant.findById(parent.restaurantId);
        },
        rider: async (parent: any) => {
            if (!parent.riderId) return null;
            return await User.findById(parent.riderId).select('-password');
        }
    }
};
