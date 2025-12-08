import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, UserRole } from '../models/User';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/starides';

const testUsers = [
    {
        email: 'admin@starides.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        phone: '+1234567890',
        role: UserRole.ADMIN,
        isVerified: true,
        isActive: true
    },
    {
        email: 'vendor@starides.com',
        password: 'vendor123',
        firstName: 'Vendor',
        lastName: 'Owner',
        phone: '+1234567891',
        role: UserRole.VENDOR,
        isVerified: true,
        isActive: true
    },
    {
        email: 'rider@starides.com',
        password: 'rider123',
        firstName: 'Delivery',
        lastName: 'Rider',
        phone: '+1234567892',
        role: UserRole.RIDER,
        isVerified: true,
        isActive: true,
        vehicleType: 'Motorcycle',
        vehicleNumber: 'ABC-1234',
        isAvailable: true
    },
    {
        email: 'customer@starides.com',
        password: 'customer123',
        firstName: 'John',
        lastName: 'Customer',
        phone: '+1234567893',
        role: UserRole.CUSTOMER,
        isVerified: true,
        isActive: true,
        addresses: [
            {
                label: 'Home',
                street: '123 Main Street',
                city: 'New York',
                state: 'NY',
                zipCode: '10001',
                coordinates: {
                    latitude: 40.7128,
                    longitude: -74.0060
                },
                isDefault: true
            }
        ]
    }
];

async function seedTestUsers() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing test users
        await User.deleteMany({
            email: {
                $in: testUsers.map(u => u.email)
            }
        });
        console.log('🗑️  Cleared existing test users');

        // Create test users
        for (const userData of testUsers) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);

            const user = new User({
                ...userData,
                password: hashedPassword
            });

            await user.save();
            console.log(`✅ Created ${userData.role}: ${userData.email}`);
        }

        console.log('\n🎉 Test users created successfully!\n');
        console.log('📋 Test User Credentials:');
        console.log('━'.repeat(50));
        testUsers.forEach(user => {
            console.log(`\n${user.role}:`);
            console.log(`  Email: ${user.email}`);
            console.log(`  Password: ${user.password}`);
        });
        console.log('\n' + '━'.repeat(50));

        await mongoose.disconnect();
        console.log('\n✅ Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding test users:', error);
        process.exit(1);
    }
}

seedTestUsers();
