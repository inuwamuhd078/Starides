import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
    orderId: mongoose.Types.ObjectId;
    customerId: mongoose.Types.ObjectId;
    restaurantId: mongoose.Types.ObjectId;
    riderId?: mongoose.Types.ObjectId;
    restaurantRating: number;
    riderRating?: number;
    foodQuality: number;
    deliverySpeed: number;
    comment?: string;
    response?: {
        text: string;
        respondedAt: Date;
    };
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
    {
        orderId: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
            unique: true
        },
        customerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        restaurantId: {
            type: Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: true
        },
        riderId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        restaurantRating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        riderRating: {
            type: Number,
            min: 1,
            max: 5
        },
        foodQuality: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        deliverySpeed: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: String,
        response: {
            text: String,
            respondedAt: Date
        }
    },
    {
        timestamps: true
    }
);

// Indexes
ReviewSchema.index({ restaurantId: 1 });
ReviewSchema.index({ customerId: 1 });
ReviewSchema.index({ riderId: 1 });

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
