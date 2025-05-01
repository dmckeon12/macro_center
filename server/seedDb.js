import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import models - using dynamic imports to avoid ESM issues
let User, Product, Order, Review;

// Database Configuration
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/macro_center';
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

/**
 * Connect to MongoDB
 */
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    console.log(`MongoDB URI: ${mongoURI}`);
    
    await mongoose.connect(mongoURI, mongooseOptions);
    console.log('MongoDB connected');
    
    // Import models after connection is established
    const UserModule = await import('./src/models/user.model.js');
    const ProductModule = await import('./src/models/product.model.js');
    const OrderModule = await import('./src/models/order.model.js');
    const ReviewModule = await import('./src/models/review.model.js');
    
    User = UserModule.default;
    Product = ProductModule.default;
    Order = OrderModule.default;
    Review = ReviewModule.default;
    
    console.log('Models imported successfully');
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Import product data
 */
const importProductData = async () => {
  try {
    // PC components data (based on MacroCenter PC Builder component)
    const products = [
      // CPU Components
      {
        category: "cpu",
        brand_name: "AMD",
        name: "Ryzen 9 7950X",
        details: "16-Core 32-Thread Desktop Processor",
        price_cents: 69900,
        status: "active",
        specs: {
          cores: 16,
          threads: 32,
          base_clock: "4.5 GHz",
          boost_clock: "5.7 GHz",
          tdp: "170W",
          socket: "AM5"
        },
        stock: true,
        quantity: 25,
        main_picture_url: "/src/assets/images/cpu-ryzen-7950x.jpg",
        description: "AMD's flagship desktop processor featuring 16 cores and 32 threads for exceptional multi-tasking and gaming performance."
      },
      {
        category: "cpu",
        brand_name: "AMD",
        name: "Ryzen 7 7700X",
        details: "8-Core 16-Thread Desktop Processor",
        price_cents: 39900,
        status: "active",
        specs: {
          cores: 8,
          threads: 16,
          base_clock: "4.5 GHz",
          boost_clock: "5.4 GHz",
          tdp: "105W",
          socket: "AM5"
        },
        stock: true,
        quantity: 40,
        main_picture_url: "/src/assets/images/cpu-ryzen-7700x.jpg",
        description: "High-performance processor with excellent gaming capabilities and content creation performance."
      },
      {
        category: "cpu",
        brand_name: "AMD",
        name: "Ryzen 5 5600X",
        details: "6-Core 12-Thread Desktop Processor",
        price_cents: 19900,
        status: "active",
        specs: {
          cores: 6,
          threads: 12,
          base_clock: "3.7 GHz",
          boost_clock: "4.6 GHz",
          tdp: "65W",
          socket: "AM4"
        },
        stock: true,
        quantity: 80,
        main_picture_url: "/src/assets/images/cpu-ryzen-5600x.jpg",
        description: "Excellent mid-range gaming CPU with incredible value and performance."
      },
      // GPU Components
      {
        category: "gpu",
        brand_name: "NVIDIA",
        name: "GeForce RTX 4080",
        details: "16GB GDDR6X Graphics Card",
        price_cents: 119900,
        status: "active",
        specs: {
          memory: "16GB GDDR6X",
          boost_clock: "2.5 GHz",
          cuda_cores: 9728,
          tdp: "320W"
        },
        stock: true,
        quantity: 15,
        main_picture_url: "/src/assets/images/gpu-rtx-4080.jpg",
        description: "High-end graphics card featuring NVIDIA's Ada Lovelace architecture for exceptional gaming and creative workloads."
      },
      {
        category: "gpu",
        brand_name: "NVIDIA",
        name: "GeForce RTX 4070",
        details: "12GB GDDR6X Graphics Card",
        price_cents: 59900,
        status: "active",
        specs: {
          memory: "12GB GDDR6X",
          boost_clock: "2.48 GHz",
          cuda_cores: 5888,
          tdp: "200W"
        },
        stock: true,
        quantity: 30,
        main_picture_url: "/src/assets/images/gpu-rtx-4070.jpg",
        description: "Mid-range GPU offering excellent performance with DLSS 3.0 and ray tracing capabilities."
      },
      // Motherboard Components
      {
        category: "motherboard",
        brand_name: "ASUS",
        name: "ROG Strix X670E-E Gaming WiFi",
        details: "AMD AM5 ATX Gaming Motherboard",
        price_cents: 49900,
        status: "active",
        specs: {
          socket: "AM5",
          chipset: "X670E",
          memory_support: "DDR5",
          form_factor: "ATX"
        },
        stock: true,
        quantity: 20,
        main_picture_url: "/src/assets/images/mb-rog-x670e.jpg",
        description: "High-end X670E chipset motherboard with premium features for AMD Ryzen 7000 series processors."
      },
      {
        category: "motherboard",
        brand_name: "MSI",
        name: "MAG B650 TOMAHAWK WIFI",
        details: "AMD AM5 ATX Gaming Motherboard",
        price_cents: 24900,
        status: "active",
        specs: {
          socket: "AM5",
          chipset: "B650",
          memory_support: "DDR5",
          form_factor: "ATX"
        },
        stock: true,
        quantity: 35,
        main_picture_url: "/src/assets/images/mb-b650-tomahawk.jpg",
        description: "Mid-range B650 chipset motherboard with excellent features and value for AMD Ryzen 7000 series processors."
      },
      // RAM Components
      {
        category: "ram",
        brand_name: "Corsair",
        name: "Vengeance RGB Pro",
        details: "32GB (2x16GB) DDR4-3600MHz CL18",
        price_cents: 11900,
        status: "active",
        specs: {
          capacity: "32GB",
          speed: "3600MHz",
          cas_latency: "CL18",
          type: "DDR4"
        },
        stock: true,
        quantity: 45,
        main_picture_url: "/src/assets/images/ram-vengeance-rgb.jpg",
        description: "High-performance DDR4 memory with RGB lighting for gaming PCs."
      },
      {
        category: "ram",
        brand_name: "G.Skill",
        name: "Trident Z5 RGB",
        details: "32GB (2x16GB) DDR5-6000MHz CL36",
        price_cents: 18900,
        status: "active",
        specs: {
          capacity: "32GB",
          speed: "6000MHz",
          cas_latency: "CL36",
          type: "DDR5"
        },
        stock: true,
        quantity: 30,
        main_picture_url: "/src/assets/images/ram-trident-z5.jpg",
        description: "Premium DDR5 memory for next-generation platforms with RGB lighting."
      },
      // Storage Components
      {
        category: "storage",
        brand_name: "Samsung",
        name: "980 PRO",
        details: "1TB PCIe 4.0 NVMe SSD",
        price_cents: 14900,
        status: "active",
        specs: {
          capacity: "1TB",
          interface: "PCIe 4.0 x4",
          seq_read: "7000 MB/s",
          seq_write: "5000 MB/s"
        },
        stock: true,
        quantity: 50,
        main_picture_url: "/src/assets/images/storage-980-pro.jpg",
        description: "High-performance PCIe 4.0 NVMe SSD for gaming and professional workloads."
      },
      {
        category: "storage",
        brand_name: "Western Digital",
        name: "WD Black SN850X",
        details: "2TB PCIe 4.0 NVMe SSD",
        price_cents: 24900,
        status: "active",
        specs: {
          capacity: "2TB",
          interface: "PCIe 4.0 x4",
          seq_read: "7300 MB/s",
          seq_write: "6600 MB/s"
        },
        stock: true,
        quantity: 35,
        main_picture_url: "/src/assets/images/storage-sn850x.jpg",
        description: "Premium NVMe SSD optimized for gaming with excellent performance."
      },
      // Power Supply Components
      {
        category: "psu",
        brand_name: "Corsair",
        name: "RM850x",
        details: "850W 80+ Gold Fully Modular",
        price_cents: 13900,
        status: "active",
        specs: {
          wattage: 850,
          efficiency: "80+ Gold",
          modularity: "Fully Modular",
          warranty: "10 years"
        },
        stock: true,
        quantity: 40,
        main_picture_url: "/src/assets/images/psu-corsair-rm850x.jpg",
        description: "High-quality power supply with 80+ Gold efficiency and fully modular cables."
      },
      {
        category: "psu",
        brand_name: "Seasonic",
        name: "FOCUS GX-750",
        details: "750W 80+ Gold Fully Modular",
        price_cents: 11900,
        status: "active",
        specs: {
          wattage: 750,
          efficiency: "80+ Gold",
          modularity: "Fully Modular",
          warranty: "10 years"
        },
        stock: true,
        quantity: 35,
        main_picture_url: "/src/assets/images/psu-corsair-rm850x.jpg", // Using placeholder as noted in memory
        description: "Reliable power supply with excellent efficiency and silent operation."
      }
    ];
    
    console.log('Importing product data...');
    // Insert all products
    await Product.insertMany(products);
    console.log(`${products.length} products imported`);
  } catch (error) {
    console.error(`Error importing products: ${error.message}`);
  }
};

/**
 * Create admin user
 */
const createAdminUser = async () => {
  try {
    console.log('Creating admin user...');
    // Check if admin user already exists
    const adminExists = await User.findOne({ email: 'admin@macrocenter.com' });
    
    if (adminExists) {
      console.log('Admin user already exists');
      return;
    }
    
    // Create admin user
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@macrocenter.com',
      password: 'Admin123456',
      role: 'admin',
      isEmailVerified: true,
    });
    
    console.log('Admin user created');
  } catch (error) {
    console.error(`Error creating admin user: ${error.message}`);
  }
};

/**
 * Create test user
 */
const createTestUser = async () => {
  try {
    console.log('Creating test user...');
    // Check if test user already exists
    const testUserExists = await User.findOne({ email: 'test@macrocenter.com' });
    
    if (testUserExists) {
      console.log('Test user already exists');
      return;
    }
    
    // Create test user
    const testUser = await User.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@macrocenter.com',
      password: 'Test123456',
      role: 'user',
      isEmailVerified: true,
    });
    
    console.log('Test user created');
  } catch (error) {
    console.error(`Error creating test user: ${error.message}`);
  }
};

/**
 * Seed database
 */
const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    
    console.log('Clearing existing data...');
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    
    console.log('Database cleared');
    
    // Import data
    await createAdminUser();
    await createTestUser();
    await importProductData();
    
    console.log('Database seeded successfully');
    
    // Disconnect
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
    
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

// Run seeder
console.log('Starting database seeder...');
seedDatabase();
