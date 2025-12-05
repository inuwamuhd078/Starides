import mongoose, { Schema, Document } from 'mongoose';

export enum RestaurantStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    SUSPENDED = 'SUSPENDED'
}

export interface IRestaurant extends Document {
    name: string;
    description: string;
    ownerId: mongoose.Types.ObjectId;
    logo?: string;
    coverImage?: string;
    cuisine: string[];
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        coordinates: {
            latitude: number;
            longitude: number;
        };
    };
    phone: string;
    email: string;
    status: RestaurantStatus;
    rating: number;
    totalReviews: number;
    isOpen: boolean;
    openingHours: Array<{
        day: string;
        open: string;
        close: string;
    }>;
    deliveryFee: number;
    minimumOrder: number;
    estimatedDeliveryTime: number; // in minutes
    createdAt: Date;
    updatedAt: Date;
}

const RestaurantSchema = new Schema<IRestaurant>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        logo: String,
        coverImage: String,
        cuisine: [String],
        address: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipCode: { type: String, required: true },
            coordinates: {
                latitude: { type: Number, required: true },
                longitude: { type: Number, required: true }
            }
        },
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: Object.values(RestaurantStatus),
            default: RestaurantStatus.PENDING
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        totalReviews: {
            type: Number,
            default: 0
        },
        isOpen: {
            type: Boolean,
            default: true
        },
        openingHours: [
            {
                day: String,
                open: String,
                close: String
            }
        ],
        deliveryFee: {
            type: Number,
            required: true,
            min: 0
        },
        minimumOrder: {
            type: Number,
            required: true,
            min: 0
        },
        estimatedDeliveryTime: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

// Indexes
RestaurantSchema.index({ ownerId: 1 });
RestaurantSchema.index({ status: 1 });
RestaurantSchema.index({ 'address.coordinates': '2dsphere' });

export const Restaurant = mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);
