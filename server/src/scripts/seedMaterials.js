import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Material from '../models/Material.model.js';
import connectDB from '../config/database.js';

dotenv.config();
connectDB();

const seedMaterials = async () => {
  try {
    // Clear existing materials (optional - comment out if you want to keep existing)
    await Material.deleteMany({});

    const materials = [
      // Yarn Materials (Raw Material)
      {
        name: 'Cotton Yarn - Premium Quality',
        materialType: 'Yarn',
        description: 'Premium quality cotton yarn for knitting',
        quantity: 1000,
        unit: 'kg',
        currentLocation: 'Internal Warehouse',
        batchNumber: 'YRN-2024-001',
        quality: 'Premium',
        color: 'White'
      },
      {
        name: 'Polyester Yarn - Standard',
        materialType: 'Yarn',
        description: 'Standard polyester yarn',
        quantity: 500,
        unit: 'kg',
        currentLocation: 'Internal Warehouse',
        batchNumber: 'YRN-2024-002',
        quality: 'Standard',
        color: 'White'
      },
      {
        name: 'Cotton Yarn - Medium Quality',
        materialType: 'Yarn',
        description: 'Medium quality cotton yarn',
        quantity: 750,
        unit: 'kg',
        currentLocation: 'Internal Warehouse',
        batchNumber: 'YRN-2024-003',
        quality: 'Medium',
        color: 'Natural'
      },
      // Grey Fabric Materials (Intermediate)
      {
        name: 'Grey Fabric - Cotton 40s',
        materialType: 'Grey Fabric',
        description: 'Grey cotton fabric 40s count',
        quantity: 2000,
        unit: 'meters',
        currentLocation: 'Internal Warehouse',
        batchNumber: 'GRY-2024-001',
        gsm: 180,
        quality: 'Standard'
      },
      {
        name: 'Grey Fabric - Cotton 30s',
        materialType: 'Grey Fabric',
        description: 'Grey cotton fabric 30s count',
        quantity: 1500,
        unit: 'meters',
        currentLocation: 'Internal Warehouse',
        batchNumber: 'GRY-2024-002',
        gsm: 200,
        quality: 'Standard'
      },
      {
        name: 'Grey Fabric - Polyester Blend',
        materialType: 'Grey Fabric',
        description: 'Grey polyester-cotton blend fabric',
        quantity: 1000,
        unit: 'meters',
        currentLocation: 'Internal Warehouse',
        batchNumber: 'GRY-2024-003',
        gsm: 160,
        quality: 'Premium'
      },
      // Finished Fabric Materials (Final Product)
      {
        name: 'Finished Fabric - Dyed Blue',
        materialType: 'Finished Fabric',
        description: 'Blue dyed cotton fabric ready for stitching',
        quantity: 800,
        unit: 'meters',
        currentLocation: 'Internal Warehouse',
        batchNumber: 'FIN-2024-001',
        color: 'Blue',
        gsm: 180,
        quality: 'Premium'
      },
      {
        name: 'Finished Fabric - Printed Floral',
        materialType: 'Finished Fabric',
        description: 'Printed floral pattern fabric',
        quantity: 600,
        unit: 'meters',
        currentLocation: 'Internal Warehouse',
        batchNumber: 'FIN-2024-002',
        color: 'Multi-color',
        gsm: 160,
        quality: 'Standard'
      }
    ];

    await Material.insertMany(materials);
    
    console.log('\n✅ Successfully created demo materials!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📦 YARN MATERIALS (Raw Material)');
    console.log('   • Cotton Yarn - Premium Quality: 1000 kg');
    console.log('   • Polyester Yarn - Standard: 500 kg');
    console.log('   • Cotton Yarn - Medium Quality: 750 kg');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📦 GREY FABRIC MATERIALS (Intermediate)');
    console.log('   • Grey Fabric - Cotton 40s: 2000 meters');
    console.log('   • Grey Fabric - Cotton 30s: 1500 meters');
    console.log('   • Grey Fabric - Polyester Blend: 1000 meters');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📦 FINISHED FABRIC MATERIALS (Final Product)');
    console.log('   • Finished Fabric - Dyed Blue: 800 meters');
    console.log('   • Finished Fabric - Printed Floral: 600 meters');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n✅ Total Materials Created: ${materials.length}`);
    console.log('📍 All materials are in "Internal Warehouse" and ready for job orders.\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding materials:', error);
    process.exit(1);
  }
};

seedMaterials();

