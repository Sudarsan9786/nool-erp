import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
  materialType: {
    type: String,
    enum: ['Yarn', 'Grey Fabric', 'Finished Fabric'],
    required: [true, 'Material type is required']
  },
  name: {
    type: String,
    required: [true, 'Material name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  unit: {
    type: String,
    enum: ['kg', 'meters', 'pieces'],
    required: true
  },
  currentLocation: {
    type: String,
    enum: ['Internal Warehouse', 'Vendor'],
    default: 'Internal Warehouse'
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    default: null
  },
  jobOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobOrder',
    default: null
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: 0
  },
  batchNumber: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    trim: true
  },
  gsm: {
    type: Number,
    min: 0
  },
  quality: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries
materialSchema.index({ materialType: 1, currentLocation: 1 });
materialSchema.index({ vendorId: 1 });
materialSchema.index({ jobOrderId: 1 });

const Material = mongoose.model('Material', materialSchema);

export default Material;

