import mongoose, { Schema, Document } from 'mongoose';

export enum UserRole {
    CUSTOMER = 'CUSTOMER',
    VENDOR = 'VENDOR',
    RIDER = 'RIDER',
    ADMIN = 'ADMIN'
}

export interface IUser extends Document {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: UserRole;
    avatar?: string;
    isActive: boolean;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    // Vendor-specific fields
    restaurantId?: mongoose.Types.ObjectId;
    // Rider-specific fields
    vehicleType?: string;
    vehicleNumber?: string;
    isAvailable?: boolean;
    // Customer-specific fields
    addresses?: Array<{
        label: string;
        street: string;
        city: string;
        state: string;
        zipCode: string;
        coordinates?: {
            latitude: number;
            longitude: number;
        };
        isDefault: boolean;
    }>;
    // Password reset fields
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            required: true
        },
        avatar: String,
        isActive: {
            type: Boolean,
            default: true
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        restaurantId: {
            type: Schema.Types.ObjectId,
            ref: 'Restaurant'
        },
        vehicleType: String,
        vehicleNumber: String,
        isAvailable: {
            type: Boolean,
            default: false
        },
        addresses: [
            {
                label: String,
                street: String,
                city: String,
                state: String,
                zipCode: String,
                coordinates: {
                    latitude: Number,
                    longitude: Number
                },
                isDefault: {
                    type: Boolean,
                    default: false
                }
            }
        ],
        resetPasswordToken: String,
        resetPasswordExpires: Date
    },
    {
        timestamps: true
    }
);

// Index for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);
