import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vendor name is required'],
    trim: true
  },
  contactPerson: {
    type: String,
    required: [true, 'Contact person name is required'],
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  whatsappNumber: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  jobWorkType: {
    type: [String],
    enum: ['Knitting', 'Dyeing', 'Printing', 'Stitching', 'Finishing'],
    required: [true, 'At least one job work type is required']
  },
  gstin: {
    type: String,
    trim: true,
    uppercase: true
  },
  pan: {
    type: String,
    trim: true,
    uppercase: true
  },
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    branch: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
vendorSchema.index({ jobWorkType: 1 });
vendorSchema.index({ isActive: 1 });

const Vendor = mongoose.model('Vendor', vendorSchema);

export default Vendor;

