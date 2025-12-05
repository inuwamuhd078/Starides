import mongoose, { Schema, Document } from 'mongoose';

export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    PREPARING = 'PREPARING',
    READY_FOR_PICKUP = 'READY_FOR_PICKUP',
    OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

export enum PaymentMethod {
    CASH = 'CASH',
    CARD = 'CARD',
    WALLET = 'WALLET'
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED'
}

export interface IOrder extends Document {
    orderNumber: string;
    customerId: mongoose.Types.ObjectId;
    restaurantId: mongoose.Types.ObjectId;
    riderId?: mongoose.Types.ObjectId;
    items: Array<{
        menuItemId: mongoose.Types.ObjectId;
        name: string;
        price: number;
        quantity: number;
        specialInstructions?: string;
    }>;
    subtotal: number;
    deliveryFee: number;
    tax: number;
    total: number;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    deliveryAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        coordinates: {
            latitude: number;
            longitude: number;
        };
    };
    specialInstructions?: string;
    estimatedDeliveryTime?: Date;
    actualDeliveryTime?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
    {
        orderNumber: {
            type: String,
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
        items: [
            {
                menuItemId: {
                    type: Schema.Types.ObjectId,
                    ref: 'MenuItem',
                    required: true
                },
                name: { type: String, required: true },
                price: { type: Number, required: true },
                quantity: { type: Number, required: true, min: 1 },
                specialInstructions: String
            }
        ],
        subtotal: {
            type: Number,
            required: true,
            min: 0
        },
        deliveryFee: {
            type: Number,
            required: true,
            min: 0
        },
        tax: {
            type: Number,
            required: true,
            min: 0
        },
        total: {
            type: Number,
            required: true,
            min: 0
        },
        status: {
            type: String,
            enum: Object.values(OrderStatus),
            default: OrderStatus.PENDING
        },
        paymentMethod: {
            type: String,
            enum: Object.values(PaymentMethod),
            required: true
        },
        paymentStatus: {
            type: String,
            enum: Object.values(PaymentStatus),
            default: PaymentStatus.PENDING
        },
        deliveryAddress: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipCode: { type: String, required: true },
            coordinates: {
                latitude: { type: Number, required: true },
                longitude: { type: Number, required: true }
            }
        },
        specialInstructions: String,
        estimatedDeliveryTime: Date,
        actualDeliveryTime: Date
    },
    {
        timestamps: true
    }
);

// Indexes
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ customerId: 1 });
OrderSchema.index({ restaurantId: 1 });
OrderSchema.index({ riderId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
