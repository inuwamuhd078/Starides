import mongoose, { Schema, Document } from 'mongoose';

export enum MenuItemCategory {
    APPETIZER = 'APPETIZER',
    MAIN_COURSE = 'MAIN_COURSE',
    DESSERT = 'DESSERT',
    BEVERAGE = 'BEVERAGE',
    SIDE_DISH = 'SIDE_DISH'
}

export interface IMenuItem extends Document {
    restaurantId: mongoose.Types.ObjectId;
    name: string;
    description: string;
    category: MenuItemCategory;
    price: number;
    image?: string;
    isAvailable: boolean;
    isVegetarian: boolean;
    isVegan: boolean;
    isGlutenFree: boolean;
    spicyLevel: number; // 0-5
    preparationTime: number; // in minutes
    calories?: number;
    ingredients: string[];
    allergens: string[];
    createdAt: Date;
    updatedAt: Date;
}

const MenuItemSchema = new Schema<IMenuItem>(
    {
        restaurantId: {
            type: Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: String,
            enum: Object.values(MenuItemCategory),
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        image: String,
        isAvailable: {
            type: Boolean,
            default: true
        },
        isVegetarian: {
            type: Boolean,
            default: false
        },
        isVegan: {
            type: Boolean,
            default: false
        },
        isGlutenFree: {
            type: Boolean,
            default: false
        },
        spicyLevel: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        preparationTime: {
            type: Number,
            required: true,
            min: 0
        },
        calories: Number,
        ingredients: [String],
        allergens: [String]
    },
    {
        timestamps: true
    }
);

// Indexes
MenuItemSchema.index({ restaurantId: 1 });
MenuItemSchema.index({ category: 1 });
MenuItemSchema.index({ isAvailable: 1 });

export const MenuItem = mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);
