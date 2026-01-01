import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.model.js';

// Load env vars
dotenv.config();

const fixPasswords = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    const demoUsers = [
      { email: 'admin@nool.com', password: 'admin123' },
      { email: 'supervisor@nool.com', password: 'supervisor123' },
      { email: 'vendor@nool.com', password: 'vendor123' }
    ];

    for (const demoUser of demoUsers) {
      const user = await User.findOne({ email: demoUser.email });
      if (user) {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(demoUser.password, salt);
        
        // Update password
        user.password = hashedPassword;
        await user.save();
        
        console.log(`✅ Fixed password for ${demoUser.email}`);
      } else {
        console.log(`⚠️  User not found: ${demoUser.email}`);
      }
    }

    console.log('\n✅ All passwords fixed!');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing passwords:', error);
    process.exit(1);
  }
};

fixPasswords();

