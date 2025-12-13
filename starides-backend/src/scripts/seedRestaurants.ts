import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, UserRole } from '../models/User';
import { Restaurant, RestaurantStatus } from '../models/Restaurant';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/starides';

const seedData = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // 1. Create a Vendor
        const vendorEmail = 'vendor@starides.com';
        let vendor = await User.findOne({ email: vendorEmail });

        if (!vendor) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('vendor123', salt);
            vendor = new User({
                email: vendorEmail,
                password: hashedPassword,
                firstName: 'Vendor',
                lastName: 'Owner',
                role: UserRole.VENDOR,
                isVerified: true,
                isActive: true
            });
            await vendor.save();
            console.log('✅ Vendor created');
        } else {
            console.log('ℹ️ Vendor already exists');
        }

        // 2. Create an Approved Restaurant
        const restaurantData = {
            ownerId: vendor._id,
            name: 'Star Burger',
            description: 'The best burgers in the galaxy!',
            cuisine: ['American', 'Fast Food', 'Burgers'],
            address: {
                street: '123 Galactic Way',
                city: 'New York',
                state: 'NY',
                zipCode: '10001',
                coordinates: {
                    latitude: 40.7128,
                    longitude: -74.0060
                }
            },
            phone: '+1234567890',
            email: 'starburger@starides.com',
            openingHours: [
                { day: 'Monday', open: '09:00', close: '22:00' },
                { day: 'Tuesday', open: '09:00', close: '22:00' },
                { day: 'Wednesday', open: '09:00', close: '22:00' },
                { day: 'Thursday', open: '09:00', close: '22:00' },
                { day: 'Friday', open: '09:00', close: '23:00' },
                { day: 'Saturday', open: '10:00', close: '23:00' },
                { day: 'Sunday', open: '10:00', close: '22:00' }
            ],
            isOpen: true,
            deliveryFee: 5.00,
            minimumOrder: 15.00,
            estimatedDeliveryTime: 30,
            status: RestaurantStatus.APPROVED, // Using Enum
            rating: 4.8,
            totalReviews: 120,
            menu: [
                {
                    name: 'Galactic Burger',
                    description: 'Double patty with cheese and secret sauce',
                    price: 12.99,
                    category: 'Burgers',
                    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
                    isAvailable: true
                },
                {
                    name: 'Nebula Fries',
                    description: 'Crispy fries with cosmic seasoning',
                    price: 4.99,
                    category: 'Sides',
                    image: 'https://images.unsplash.com/photo-1541592103048-f8ce8701ff38?w=500',
                    isAvailable: true
                }
            ]
        };

        const existingRestaurant = await Restaurant.findOne({ name: restaurantData.name });
        if (!existingRestaurant) {
            const restaurant = new Restaurant(restaurantData);
            await restaurant.save();
            console.log('✅ Approved restaurant "Star Burger" created');
        } else {
            // Ensure it's approved and has correct structure
            existingRestaurant.status = RestaurantStatus.APPROVED;
            // Update other fields to match schema if needed
            existingRestaurant.phone = restaurantData.phone;
            existingRestaurant.email = restaurantData.email;
            existingRestaurant.openingHours = restaurantData.openingHours;

            await existingRestaurant.save();
            console.log('ℹ️ Updated "Star Burger" status to APPROVED');
        }

        console.log('\n🎉 Seed completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
