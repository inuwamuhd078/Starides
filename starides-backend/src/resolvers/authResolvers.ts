import { User } from '../models';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { Context, requireAuth } from '../middleware/auth';

interface RegisterInput {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: string;
}

interface LoginInput {
    email: string;
    password: string;
}

export const authResolvers = {
    Query: {
        me: async (_: any, __: any, context: Context) => {
            const user = requireAuth(context);
            return await User.findById(user.userId);
        }
    },

    Mutation: {
        register: async (_: any, { input }: { input: RegisterInput }) => {
            // Check if user already exists
            const existingUser = await User.findOne({ email: input.email });
            if (existingUser) {
                throw new Error('User with this email already exists');
            }

            // Hash password
            const hashedPassword = await hashPassword(input.password);

            // Create user
            const user = await User.create({
                ...input,
                password: hashedPassword
            });

            // Generate token
            const token = generateToken(user);

            return {
                token,
                user
            };
        },

        login: async (_: any, { input }: { input: LoginInput }) => {
            // Find user
            const user = await User.findOne({ email: input.email });
            if (!user) {
                throw new Error('Invalid email or password');
            }

            // Verify password
            const isValidPassword = await comparePassword(input.password, user.password);
            if (!isValidPassword) {
                throw new Error('Invalid email or password');
            }

            // Check if user is active
            if (!user.isActive) {
                throw new Error('Account is deactivated');
            }

            // Generate token
            const token = generateToken(user);

            return {
                token,
                user
            };
        }
    }
};
