import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vendor from '../models/Vendor.model.js';

// Load env vars
dotenv.config();

const demoVendors = [
  {
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
    pan: 'AAAAA0000A',
    bankDetails: {
      accountNumber: '1234567890',
      ifscCode: 'SBIN0001234',
      bankName: 'State Bank of India',
      branch: 'Tirupur Main Branch'
    },
    isActive: true,
    rating: 4.5
  },
  {
    name: 'XYZ Knitting Mills',
    contactPerson: 'Suresh Kumar',
    email: 'info@xyzknitting.com',
    phone: '+919876543211',
    whatsappNumber: '+919876543211',
    address: {
      street: '456 Knitting Road',
      city: 'Erode',
      state: 'Tamil Nadu',
      pincode: '638001',
      country: 'India'
    },
    jobWorkType: ['Knitting'],
    gstin: '33BBBBB0000B2Z6',
    pan: 'BBBBB0000B',
    bankDetails: {
      accountNumber: '2345678901',
      ifscCode: 'HDFC0002345',
      bankName: 'HDFC Bank',
      branch: 'Erode Branch'
    },
    isActive: true,
    rating: 4.2
  },
  {
    name: 'Premium Printing House',
    contactPerson: 'Lakshmi Devi',
    email: 'sales@premiumprinting.com',
    phone: '+919876543212',
    whatsappNumber: '+919876543212',
    address: {
      street: '789 Printing Avenue',
      city: 'Tirupur',
      state: 'Tamil Nadu',
      pincode: '641602',
      country: 'India'
    },
    jobWorkType: ['Printing'],
    gstin: '33CCCCC0000C3Z7',
    pan: 'CCCCC0000C',
    bankDetails: {
      accountNumber: '3456789012',
      ifscCode: 'ICIC0003456',
      bankName: 'ICICI Bank',
      branch: 'Tirupur Branch'
    },
    isActive: true,
    rating: 4.7
  },
  {
    name: 'Master Stitching Unit',
    contactPerson: 'Karthik M',
    email: 'contact@masterstitching.com',
    phone: '+919876543213',
    whatsappNumber: '+919876543213',
    address: {
      street: '321 Stitching Lane',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      pincode: '641001',
      country: 'India'
    },
    jobWorkType: ['Stitching'],
    gstin: '33DDDDD0000D4Z8',
    pan: 'DDDDD0000D',
    bankDetails: {
      accountNumber: '4567890123',
      ifscCode: 'AXIS0004567',
      bankName: 'Axis Bank',
      branch: 'Coimbatore Branch'
    },
    isActive: true,
    rating: 4.3
  },
  {
    name: 'Elite Finishing Works',
    contactPerson: 'Priya S',
    email: 'info@elitefinishing.com',
    phone: '+919876543214',
    whatsappNumber: '+919876543214',
    address: {
      street: '654 Finishing Street',
      city: 'Erode',
      state: 'Tamil Nadu',
      pincode: '638002',
      country: 'India'
    },
    jobWorkType: ['Finishing'],
    gstin: '33EEEEE0000E5Z9',
    pan: 'EEEEE0000E',
    bankDetails: {
      accountNumber: '5678901234',
      ifscCode: 'KOTAK0005678',
      bankName: 'Kotak Mahindra Bank',
      branch: 'Erode Branch'
    },
    isActive: true,
    rating: 4.6
  },
  {
    name: 'Multi-Work Textiles',
    contactPerson: 'Mohan R',
    email: 'sales@multiwork.com',
    phone: '+919876543215',
    whatsappNumber: '+919876543215',
    address: {
      street: '987 Industrial Area',
      city: 'Tirupur',
      state: 'Tamil Nadu',
      pincode: '641603',
      country: 'India'
    },
    jobWorkType: ['Dyeing', 'Printing', 'Finishing'],
    gstin: '33FFFFF0000F6Z0',
    pan: 'FFFFF0000F',
    bankDetails: {
      accountNumber: '6789012345',
      ifscCode: 'PNB0006789',
      bankName: 'Punjab National Bank',
      branch: 'Tirupur Branch'
    },
    isActive: true,
    rating: 4.8
  }
];

const seedVendors = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Clear existing vendors (optional - comment out if you want to keep existing)
    // await Vendor.deleteMany({});
    // console.log('Cleared existing vendors');

    // Check if vendors already exist
    const existingVendors = await Vendor.find({});
    if (existingVendors.length > 0) {
      console.log(`Found ${existingVendors.length} existing vendors. Skipping seed.`);
      console.log('To re-seed, delete existing vendors first or modify the script.');
      process.exit(0);
    }

    // Insert demo vendors
    const vendors = await Vendor.insertMany(demoVendors);
    console.log(`✅ Successfully created ${vendors.length} demo vendors:`);
    
    vendors.forEach((vendor, index) => {
      console.log(`${index + 1}. ${vendor.name} - ${vendor.jobWorkType.join(', ')}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding vendors:', error);
    process.exit(1);
  }
};

// Run the seed function
seedVendors();

