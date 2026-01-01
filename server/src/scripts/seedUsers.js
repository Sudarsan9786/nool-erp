import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.model.js';
import Vendor from '../models/Vendor.model.js';

// Load env vars
dotenv.config();

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Check if users already exist
    const existingUsers = await User.find({});
    if (existingUsers.length > 0) {
      console.log(`Found ${existingUsers.length} existing users.`);
      console.log('To re-seed, delete existing users first or modify the script.');
      
      // Show existing users
      existingUsers.forEach(user => {
        console.log(`- ${user.email} (${user.role})`);
      });
      
      process.exit(0);
    }

    // Create a demo vendor first (for vendor user)
    let demoVendor = await Vendor.findOne({ name: 'ABC Dyeing Works' });
    if (!demoVendor) {
      demoVendor = await Vendor.create({
        name: 'ABC Dyeing Works',
        contactPerson: 'Raj Kumar',
        email: 'contact@abcdyeing.com',
        phone: '+919876543210',
        whatsappNumber: '+919876543210',
        address: {
          street: '123 Textile Street',
          city: 'Tirupur',
          state: 'Tamil Nadu',
          pincode: '641601',
          country: 'India'
        },
        jobWorkType: ['Dyeing'],
        gstin: '33AAAAA0000A1Z5',
        isActive: true
      });
      console.log('Created demo vendor: ABC Dyeing Works');
    }

    // Demo users
    const demoUsers = [
      {
        name: 'Admin User',
        email: 'admin@nool.com',
        password: 'admin123',
        role: 'Admin',
        phone: '+919876543200'
      },
      {
        name: 'Supervisor User',
        email: 'supervisor@nool.com',
        password: 'supervisor123',
        role: 'Supervisor',
        phone: '+919876543201'
      },
      {
        name: 'Vendor User',
        email: 'vendor@nool.com',
        password: 'vendor123',
        role: 'Vendor',
        phone: '+919876543202',
        vendorId: demoVendor._id
      }
    ];

    // Hash passwords before creating (insertMany bypasses pre-save hooks)
    const usersWithHashedPasswords = await Promise.all(
      demoUsers.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return {
          ...user,
          password: hashedPassword
        };
      })
    );

    // Create users
    const users = await User.insertMany(usersWithHashedPasswords);
    
    console.log('\n✅ Successfully created demo users:\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 ADMIN USER');
    console.log('   Email: admin@nool.com');
    console.log('   Password: admin123');
    console.log('   Access: Full system access');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 SUPERVISOR USER');
    console.log('   Email: supervisor@nool.com');
    console.log('   Password: supervisor123');
    console.log('   Access: Operational access (cannot delete)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 VENDOR USER');
    console.log('   Email: vendor@nool.com');
    console.log('   Password: vendor123');
    console.log('   Access: View own job orders only');
    console.log('   Linked Vendor: ABC Dyeing Works');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

// Run the seed function
seedUsers();

