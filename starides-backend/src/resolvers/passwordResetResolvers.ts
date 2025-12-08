import { User } from '../models/User';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { emailService } from '../utils/emailService';

interface RequestPasswordResetInput {
    email: string;
}

interface ResetPasswordInput {
    token: string;
    newPassword: string;
}

export const passwordResetResolvers = {
    Mutation: {
        requestPasswordReset: async (_: any, { input }: { input: RequestPasswordResetInput }) => {
            try {
                const { email } = input;

                // Find user by email
                const user = await User.findOne({ email: email.toLowerCase() });

                // Always return true to prevent email enumeration
                if (!user) {
                    console.log(`Password reset requested for non-existent email: ${email}`);
                    return true;
                }

                // Generate reset token
                const resetToken = crypto.randomBytes(32).toString('hex');

                // Hash token before storing
                const hashedToken = crypto
                    .createHash('sha256')
                    .update(resetToken)
                    .digest('hex');

                // Set token and expiration (1 hour from now)
                user.resetPasswordToken = hashedToken;
                user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

                await user.save();

                // Send email with reset link
                try {
                    await emailService.sendPasswordResetEmail(email, resetToken);
                    console.log(`✅ Password reset email sent to: ${email}`);
                } catch (emailError) {
                    console.error('❌ Error sending password reset email:', emailError);
                    // Don't throw error to prevent revealing if email exists
                }

                return true;
            } catch (error) {
                console.error('Error in requestPasswordReset:', error);
                throw new Error('Failed to process password reset request');
            }
        },

        resetPassword: async (_: any, { input }: { input: ResetPasswordInput }) => {
            try {
                const { token, newPassword } = input;

                // Validate password
                if (!newPassword || newPassword.length < 6) {
                    throw new Error('Password must be at least 6 characters long');
                }

                // Hash the token to compare with stored hash
                const hashedToken = crypto
                    .createHash('sha256')
                    .update(token)
                    .digest('hex');

                // Find user with valid token
                const user = await User.findOne({
                    resetPasswordToken: hashedToken,
                    resetPasswordExpires: { $gt: new Date() },
                });

                if (!user) {
                    throw new Error('Invalid or expired password reset token');
                }

                // Hash new password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(newPassword, salt);

                // Update password and clear reset token
                user.password = hashedPassword;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                await user.save();

                // Send confirmation email
                try {
                    await emailService.sendPasswordResetConfirmation(user.email);
                    console.log(`✅ Password reset confirmation sent to: ${user.email}`);
                } catch (emailError) {
                    console.error('❌ Error sending confirmation email:', emailError);
                    // Don't throw error, password was already reset
                }

                console.log(`✅ Password successfully reset for user: ${user.email}`);
                return true;
            } catch (error: any) {
                console.error('Error in resetPassword:', error);
                throw new Error(error.message || 'Failed to reset password');
            }
        },
    },
};
