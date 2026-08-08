const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Vehicle = require('../models/Vehicle');
const Category = require('../models/Category');
const Review = require('../models/Review');
const Order = require('../models/Order');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ev_marketplace');
    console.log('MongoDB Connected for Enhanced Seeding...');
  } catch (err) {
    console.error(`Seeding DB Error: ${err.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  try {
    console.log('Clearing existing database collections...');
    await User.deleteMany();
    await Vendor.deleteMany();
    await Vehicle.deleteMany();
    await Category.deleteMany();
    await Review.deleteMany();
    await Order.deleteMany();

    console.log('Creating Vehicle Categories...');
    const categories = await Category.insertMany([
      { name: 'SUV & Crossover', slug: 'suv-crossover', description: 'Spacious electric SUVs built for comfort and road trips', icon: 'ShieldCheck' },
      { name: 'Sedan & Fastback', slug: 'sedan-fastback', description: 'Sleek aerodynamic electric sedans with high efficiency', icon: 'Zap' },
      { name: 'Hatchback', slug: 'hatchback', description: 'Compact city EVs perfect for daily urban commuting', icon: 'Car' },
      { name: 'Luxury & Sports', slug: 'luxury-sports', description: 'High-performance premium electric luxury vehicles', icon: 'Award' },
    ]);

    console.log('Creating Core Accounts (Admin, Vendors & Customers)...');
    // Default password for all demo seed accounts: Password123
    const adminUser = await User.create({
      name: 'Marketplace Admin',
      email: 'admin@evmarketplace.com',
      password: 'Password123',
      phone: '+91 98765 00000',
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    });

    const customerUser = await User.create({
      name: 'Rahul Sharma',
      email: 'customer@gmail.com',
      password: 'Password123',
      phone: '+91 91234 56789',
      role: 'CUSTOMER',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      address: {
        street: '42 Green Park Extension',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110016',
        country: 'India',
      },
    });

    // 10 Demo Vendors
    const vendorConfigs = [
      { businessName: 'VoltDrive Motors', ownerName: 'Amit Varma', email: 'voltdrive.demo@example.com', phone: '+91 98765 00001', location: 'Mumbai, Maharashtra', rating: 4.9, sales: 24, logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=300&q=80' },
      { businessName: 'GreenMotion EV Hub', ownerName: 'Sanjay Kulkarni', email: 'greenmotion.demo@example.com', phone: '+91 98765 00002', location: 'Pune, Maharashtra', rating: 4.8, sales: 18, logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=300&q=80' },
      { businessName: 'EcoRide Motors', ownerName: 'Priya Nair', email: 'ecoride.demo@example.com', phone: '+91 98765 00003', location: 'Bengaluru, Karnataka', rating: 4.9, sales: 31, logo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80' },
      { businessName: 'FutureDrive EV', ownerName: 'Vikram Singh', email: 'futuredrive.demo@example.com', phone: '+91 98765 00004', location: 'Delhi NCR', rating: 4.7, sales: 15, logo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80' },
      { businessName: 'Electra Motors', ownerName: 'Rajesh Reddy', email: 'electra.demo@example.com', phone: '+91 98765 00005', location: 'Hyderabad, Telangana', rating: 4.8, sales: 22, logo: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=300&q=80' },
      { businessName: 'Urban EV Motors', ownerName: 'Neha Patil', email: 'urbanev.demo@example.com', phone: '+91 98765 00006', location: 'Navi Mumbai, Maharashtra', rating: 4.6, sales: 12, logo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=300&q=80' },
      { businessName: 'ChargePoint Auto', ownerName: 'Karan Patel', email: 'chargepoint.demo@example.com', phone: '+91 98765 00007', location: 'Ahmedabad, Gujarat', rating: 4.7, sales: 19, logo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80' },
      { businessName: 'EV Nation Motors', ownerName: 'Anand Kumar', email: 'evnation.demo@example.com', phone: '+91 98765 00008', location: 'Chennai, Tamil Nadu', rating: 4.9, sales: 27, logo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
      { businessName: 'GreenWheel Automobiles', ownerName: 'Mahesh Jadhav', email: 'greenwheel.demo@example.com', phone: '+91 98765 00009', location: 'Nashik, Maharashtra', rating: 4.5, sales: 9, logo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80' },
      { businessName: 'E-Motion Auto Hub', ownerName: 'Deepak Deshmukh', email: 'emotion.demo@example.com', phone: '+91 98765 00010', location: 'Thane, Maharashtra', rating: 4.6, sales: 14, logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
    ];

    const createdVendors = [];
    for (const cfg of vendorConfigs) {
      const u = await User.create({
        name: cfg.ownerName,
        email: cfg.email,
        password: 'Password123',
        phone: cfg.phone,
        role: 'VENDOR',
        avatar: cfg.logo,
      });

      const v = await Vendor.create({
        user: u._id,
        businessName: cfg.businessName,
        description: `Certified electric vehicle dealership located in ${cfg.location}.`,
        logo: cfg.logo,
        contactPhone: cfg.phone,
        contactEmail: cfg.email,
        status: 'APPROVED',
        rating: cfg.rating,
        totalSales: cfg.sales,
      });

      createdVendors.push(v);
    }

    console.log(`Created ${createdVendors.length} Demo Vendors.`);

    // Map categories by slug for easy lookup
    const catMap = {
      suv: categories[0]._id,
      sedan: categories[1]._id,
      hatchback: categories[2]._id,
      luxury: categories[3]._id,
    };

    console.log('Seeding 36 Realistic EV Listings...');

    const rawVehicles = [
      // Tata Models
      {
        title: 'Tata Nexon EV Max Tech Lux',
        brand: 'Tata',
        model: 'Nexon EV',
        year: 2025,
        price: 1499000,
        condition: 'NEW',
        rangeKm: 465,
        batteryCapacityKwh: 40.5,
        chargingTimeHours: 6,
        topSpeedKmh: 140,
        seatingCapacity: 5,
        bodyType: 'SUV',
        location: 'Mumbai, Maharashtra',
        features: ['12.3 inch Touchscreen', 'Ventilated Front Seats', '360 Camera', 'Sunroof', 'Wireless Charger'],
        images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'],
        catKey: 'suv',
        isFeatured: true,
        status: 'APPROVED',
      },
      {
        title: 'Tata Curvv EV Empowered+ 55',
        brand: 'Tata',
        model: 'Curvv EV',
        year: 2025,
        price: 1925000,
        condition: 'NEW',
        rangeKm: 585,
        batteryCapacityKwh: 55,
        chargingTimeHours: 7.5,
        topSpeedKmh: 160,
        seatingCapacity: 5,
        bodyType: 'Crossover',
        location: 'Pune, Maharashtra',
        features: ['Level 2 ADAS', 'Gesture Control Tailgate', 'Panoramic Sunroof', 'Ambient Lighting'],
        images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'],
        catKey: 'suv',
        isFeatured: true,
        status: 'APPROVED',
      },
      {
        title: 'Tata Punch EV Empowered+ 35',
        brand: 'Tata',
        model: 'Punch EV',
        year: 2025,
        price: 1199000,
        condition: 'NEW',
        rangeKm: 421,
        batteryCapacityKwh: 35,
        chargingTimeHours: 5,
        topSpeedKmh: 135,
        seatingCapacity: 5,
        bodyType: 'Hatchback',
        location: 'Bengaluru, Karnataka',
        features: ['10.25 inch Screen', 'Front Airbags', 'Jewel Control Knob', 'Fast Charging'],
        images: ['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80'],
        catKey: 'hatchback',
        isFeatured: false,
        status: 'APPROVED',
      },
      {
        title: 'Tata Tiago EV Tech Lux',
        brand: 'Tata',
        model: 'Tiago EV',
        year: 2024,
        price: 899000,
        condition: 'NEW',
        rangeKm: 315,
        batteryCapacityKwh: 24,
        chargingTimeHours: 5,
        topSpeedKmh: 120,
        seatingCapacity: 5,
        bodyType: 'Hatchback',
        location: 'Delhi NCR',
        features: ['ZConnect Connected Car', 'Harman 8-Speaker Audio', 'Automatic Climate Control'],
        images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'],
        catKey: 'hatchback',
        isFeatured: false,
        status: 'APPROVED',
      },
      {
        title: 'Tata Tigor EV XZ+ Pre-Owned',
        brand: 'Tata',
        model: 'Tigor EV',
        year: 2023,
        price: 980000,
        condition: 'USED',
        mileage: 12500,
        rangeKm: 306,
        batteryCapacityKwh: 26,
        chargingTimeHours: 5.5,
        topSpeedKmh: 120,
        seatingCapacity: 5,
        bodyType: 'Sedan',
        location: 'Hyderabad, Telangana',
        features: ['Single Previous Owner', 'Complete Service History', 'Battery Warranty Active'],
        images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'],
        catKey: 'sedan',
        isFeatured: false,
        status: 'APPROVED',
      },

      // Mahindra Models
      {
        title: 'Mahindra XUV400 EV EL Pro',
        brand: 'Mahindra',
        model: 'XUV400',
        year: 2025,
        price: 1549000,
        condition: 'NEW',
        rangeKm: 456,
        batteryCapacityKwh: 39.4,
        chargingTimeHours: 6,
        topSpeedKmh: 150,
        seatingCapacity: 5,
        bodyType: 'SUV',
        location: 'Ahmedabad, Gujarat',
        features: ['Dual 10.25 screens', 'L-Drive Mode', '6 Airbags', 'IP67 Battery Protection'],
        images: ['https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80'],
        catKey: 'suv',
        isFeatured: false,
        status: 'APPROVED',
      },
      {
        title: 'Mahindra BE 05 Electric Concept',
        brand: 'Mahindra',
        model: 'BE 05',
        year: 2025,
        price: 2250000,
        condition: 'NEW',
        rangeKm: 500,
        batteryCapacityKwh: 60,
        chargingTimeHours: 6.5,
        topSpeedKmh: 175,
        seatingCapacity: 5,
        bodyType: 'SUV',
        location: 'Mumbai, Maharashtra',
        features: ['INGLO Platform', 'Next-Gen HUD', 'Ultra-Fast Charging', 'Futuristic Design'],
        images: ['https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80'],
        catKey: 'suv',
        isFeatured: true,
        status: 'APPROVED',
      },

      // Hyundai Models
      {
        title: 'Hyundai Ioniq 5 AWD',
        brand: 'Hyundai',
        model: 'Ioniq 5',
        year: 2024,
        price: 4605000,
        condition: 'NEW',
        rangeKm: 631,
        batteryCapacityKwh: 72.6,
        chargingTimeHours: 6.5,
        topSpeedKmh: 185,
        seatingCapacity: 5,
        bodyType: 'Crossover',
        location: 'Hyderabad, Telangana',
        features: ['800V Ultra-Fast Charging', 'V2L Vehicle to Load', 'Bose Audio', 'Pop-out Handles'],
        images: ['https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80'],
        catKey: 'suv',
        isFeatured: true,
        status: 'APPROVED',
      },
      {
        title: 'Hyundai Kona Electric Premium',
        brand: 'Hyundai',
        model: 'Kona EV',
        year: 2022,
        price: 1680000,
        condition: 'USED',
        mileage: 18500,
        rangeKm: 452,
        batteryCapacityKwh: 39.2,
        chargingTimeHours: 6,
        topSpeedKmh: 155,
        seatingCapacity: 5,
        bodyType: 'SUV',
        location: 'Navi Mumbai, Maharashtra',
        features: ['Shift-by-Wire Drive', 'Sunroof', 'Front Ventilated Seats'],
        images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'],
        catKey: 'suv',
        isFeatured: false,
        status: 'APPROVED',
      },

      // MG Models
      {
        title: 'MG ZS EV Exclusive Pro',
        brand: 'MG',
        model: 'ZS EV',
        year: 2025,
        price: 1898000,
        condition: 'NEW',
        rangeKm: 461,
        batteryCapacityKwh: 50.3,
        chargingTimeHours: 8,
        topSpeedKmh: 140,
        seatingCapacity: 5,
        bodyType: 'SUV',
        location: 'Nashik, Maharashtra',
        features: ['i-SMART 75+ Features', 'Panoramic Skyroof', 'Digital Bluetooth Key', '360 Camera'],
        images: ['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80'],
        catKey: 'suv',
        isFeatured: false,
        status: 'APPROVED',
      },
      {
        title: 'MG Comet EV Plush Smart City',
        brand: 'MG',
        model: 'Comet EV',
        year: 2024,
        price: 798000,
        condition: 'NEW',
        rangeKm: 230,
        batteryCapacityKwh: 17.3,
        chargingTimeHours: 7,
        topSpeedKmh: 100,
        seatingCapacity: 4,
        bodyType: 'Hatchback',
        location: 'Thane, Maharashtra',
        features: ['Dual 10.25 Screens', 'Ultra Compact Turning Radius', 'Wireless Apple CarPlay'],
        images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'],
        catKey: 'hatchback',
        isFeatured: false,
        status: 'APPROVED',
      },

      // Kia Models
      {
        title: 'Kia EV6 GT-Line AWD',
        brand: 'Kia',
        model: 'EV6',
        year: 2024,
        price: 6095000,
        condition: 'NEW',
        rangeKm: 708,
        batteryCapacityKwh: 77.4,
        chargingTimeHours: 7,
        topSpeedKmh: 192,
        seatingCapacity: 5,
        bodyType: 'Luxury',
        location: 'Chennai, Tamil Nadu',
        features: ['AR Head-Up Display', 'Meridian Sound System', 'Smart Cruise Control', 'Dual LED Headlamps'],
        images: ['https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80'],
        catKey: 'luxury',
        isFeatured: true,
        status: 'APPROVED',
      },
      {
        title: 'Kia EV9 GT-Line 7-Seater',
        brand: 'Kia',
        model: 'EV9',
        year: 2025,
        price: 12900000,
        condition: 'NEW',
        rangeKm: 541,
        batteryCapacityKwh: 99.8,
        chargingTimeHours: 8.5,
        topSpeedKmh: 200,
        seatingCapacity: 7,
        bodyType: 'Luxury',
        location: 'Mumbai, Maharashtra',
        features: ['Swiveling 2nd Row Seats', 'Dual Sunroofs', 'Terrain Mode', 'Digital Side Mirrors'],
        images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80'],
        catKey: 'luxury',
        isFeatured: false,
        status: 'APPROVED',
      },

      // BYD Models
      {
        title: 'BYD Atto 3 Superior Extended',
        brand: 'BYD',
        model: 'Atto 3',
        year: 2024,
        price: 2499000,
        condition: 'NEW',
        rangeKm: 521,
        batteryCapacityKwh: 60.48,
        chargingTimeHours: 8,
        topSpeedKmh: 160,
        seatingCapacity: 5,
        bodyType: 'SUV',
        location: 'Bengaluru, Karnataka',
        features: ['BYD Blade Battery', 'Rotating 12.8 inch Touchscreen', 'Level 2 ADAS'],
        images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'],
        catKey: 'suv',
        isFeatured: false,
        status: 'APPROVED',
      },
      {
        title: 'BYD Seal Performance AWD',
        brand: 'BYD',
        model: 'Seal',
        year: 2025,
        price: 4550000,
        condition: 'NEW',
        rangeKm: 650,
        batteryCapacityKwh: 82.5,
        chargingTimeHours: 7,
        topSpeedKmh: 180,
        seatingCapacity: 5,
        bodyType: 'Sedan',
        location: 'Pune, Maharashtra',
        features: ['0-100 in 3.8 sec', 'Cell-to-Body Tech', 'Dynaudio 12 Speakers', 'Glass Roof'],
        images: ['https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80'],
        catKey: 'sedan',
        isFeatured: true,
        status: 'APPROVED',
      },

      // Tesla Models
      {
        title: 'Tesla Model 3 Long Range AWD',
        brand: 'Tesla',
        model: 'Model 3',
        year: 2025,
        price: 4500000,
        condition: 'NEW',
        rangeKm: 629,
        batteryCapacityKwh: 75,
        chargingTimeHours: 6.5,
        topSpeedKmh: 201,
        seatingCapacity: 5,
        bodyType: 'Sedan',
        location: 'Mumbai, Maharashtra',
        features: ['Autopilot Dual Motor', 'Glass Roof', '15 inch Central Touchscreen', 'Premium Sound'],
        images: ['https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80'],
        catKey: 'sedan',
        isFeatured: true,
        status: 'APPROVED',
      },
      {
        title: 'Tesla Model Y Performance',
        brand: 'Tesla',
        model: 'Model Y',
        year: 2025,
        price: 5200000,
        condition: 'NEW',
        rangeKm: 533,
        batteryCapacityKwh: 81,
        chargingTimeHours: 7,
        topSpeedKmh: 250,
        seatingCapacity: 5,
        bodyType: 'SUV',
        location: 'Bengaluru, Karnataka',
        features: ['All-Wheel Drive', 'Power Liftgate', 'HEPA Filtration System', 'Supercharging'],
        images: ['https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80'],
        catKey: 'suv',
        isFeatured: true,
        status: 'APPROVED',
      },
      {
        title: 'Tesla Model S Plaid Tri-Motor',
        brand: 'Tesla',
        model: 'Model S',
        year: 2025,
        price: 13000000,
        condition: 'NEW',
        rangeKm: 637,
        batteryCapacityKwh: 100,
        chargingTimeHours: 7.5,
        topSpeedKmh: 322,
        seatingCapacity: 5,
        bodyType: 'Luxury',
        location: 'Delhi NCR',
        features: ['1020 Horsepower', '0-100 in 2.1 sec', 'Yoke Steering', '22-Speaker Audio'],
        images: ['https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1200&q=80'],
        catKey: 'luxury',
        isFeatured: false,
        status: 'APPROVED',
      },

      // BMW Models
      {
        title: 'BMW iX1 xDrive30 M Sport',
        brand: 'BMW',
        model: 'iX1',
        year: 2025,
        price: 6690000,
        condition: 'NEW',
        rangeKm: 440,
        batteryCapacityKwh: 64.7,
        chargingTimeHours: 6.5,
        topSpeedKmh: 180,
        seatingCapacity: 5,
        bodyType: 'Luxury',
        location: 'Mumbai, Maharashtra',
        features: ['BMW Curved Display', 'M Sport Package', 'Harman Kardon Audio', 'Adaptive M Suspension'],
        images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80'],
        catKey: 'luxury',
        isFeatured: true,
        status: 'APPROVED',
      },
      {
        title: 'BMW i4 eDrive40 Sport Sedan',
        brand: 'BMW',
        model: 'i4',
        year: 2024,
        price: 7250000,
        condition: 'NEW',
        rangeKm: 590,
        batteryCapacityKwh: 83.9,
        chargingTimeHours: 7.5,
        topSpeedKmh: 190,
        seatingCapacity: 5,
        bodyType: 'Luxury',
        location: 'Pune, Maharashtra',
        features: ['340 HP Rear Wheel Drive', 'BMW OS 8', 'Comfort Access System'],
        images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80'],
        catKey: 'luxury',
        isFeatured: false,
        status: 'APPROVED',
      },

      // Mercedes-Benz Models
      {
        title: 'Mercedes-Benz EQB 350 4MATIC',
        brand: 'Mercedes-Benz',
        model: 'EQB',
        year: 2024,
        price: 7750000,
        condition: 'NEW',
        rangeKm: 520,
        batteryCapacityKwh: 66.5,
        chargingTimeHours: 6.5,
        topSpeedKmh: 160,
        seatingCapacity: 7,
        bodyType: 'Luxury',
        location: 'Bengaluru, Karnataka',
        features: ['7-Seater Layout', 'MBUX Navigation with EV Intelligence', 'Burmester Surround'],
        images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80'],
        catKey: 'luxury',
        isFeatured: false,
        status: 'APPROVED',
      },
      {
        title: 'Mercedes-Benz EQS 580 4MATIC',
        brand: 'Mercedes-Benz',
        model: 'EQS',
        year: 2025,
        price: 16200000,
        condition: 'NEW',
        rangeKm: 857,
        batteryCapacityKwh: 107.8,
        chargingTimeHours: 8.5,
        topSpeedKmh: 210,
        seatingCapacity: 5,
        bodyType: 'Luxury',
        location: 'Delhi NCR',
        features: ['MBUX Hyperscreen 56-inch', 'Rear Axle Steering', 'Airmatic Suspension'],
        images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80'],
        catKey: 'luxury',
        isFeatured: true,
        status: 'APPROVED',
      },

      // Audi Models
      {
        title: 'Audi Q8 e-tron 55 quattro',
        brand: 'Audi',
        model: 'Q8 e-tron',
        year: 2025,
        price: 11400000,
        condition: 'NEW',
        rangeKm: 600,
        batteryCapacityKwh: 114,
        chargingTimeHours: 9,
        topSpeedKmh: 200,
        seatingCapacity: 5,
        bodyType: 'Luxury',
        location: 'Ahmedabad, Gujarat',
        features: ['Virtual Mirrors', 'Matrix LED Headlamps', 'Bang & Olufsen 3D Sound'],
        images: ['https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80'],
        catKey: 'luxury',
        isFeatured: false,
        status: 'APPROVED',
      },

      // Volvo Models
      {
        title: 'Volvo XC40 Recharge Twin AWD',
        brand: 'Volvo',
        model: 'XC40 Recharge',
        year: 2024,
        price: 5790000,
        condition: 'NEW',
        rangeKm: 518,
        batteryCapacityKwh: 78,
        chargingTimeHours: 7,
        topSpeedKmh: 180,
        seatingCapacity: 5,
        bodyType: 'SUV',
        location: 'Chandigarh',
        features: ['408 HP Twin Motor', 'Google Built-in Services', 'Harman Kardon Audio'],
        images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'],
        catKey: 'suv',
        isFeatured: false,
        status: 'APPROVED',
      },

      // Used & Pending Approvals Listings for Workflow Demo
      {
        title: 'Porsche Taycan 4S Performance',
        brand: 'Porsche',
        model: 'Taycan',
        year: 2025,
        price: 16100000,
        condition: 'NEW',
        rangeKm: 512,
        batteryCapacityKwh: 93.4,
        chargingTimeHours: 7.5,
        topSpeedKmh: 250,
        seatingCapacity: 4,
        bodyType: 'Luxury',
        location: 'Mumbai, Maharashtra',
        features: ['Launch Control', '800V Architecture', 'Porsche Active Suspension'],
        images: ['https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80'],
        catKey: 'luxury',
        isFeatured: false,
        status: 'PENDING_APPROVAL',
      },
      {
        title: 'Tata Nexon EV Prime XZ+ (2022)',
        brand: 'Tata',
        model: 'Nexon EV',
        year: 2022,
        price: 1080000,
        condition: 'USED',
        mileage: 24000,
        rangeKm: 312,
        batteryCapacityKwh: 30.2,
        chargingTimeHours: 6,
        topSpeedKmh: 120,
        seatingCapacity: 5,
        bodyType: 'SUV',
        location: 'Nashik, Maharashtra',
        features: ['Single Owner', 'Battery Health 96%', 'Fast Charger Included'],
        images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'],
        catKey: 'suv',
        isFeatured: false,
        status: 'PENDING_APPROVAL',
      },
      {
        title: 'MG ZS EV Excite Pre-Owned',
        brand: 'MG',
        model: 'ZS EV',
        year: 2023,
        price: 1420000,
        condition: 'USED',
        mileage: 15000,
        rangeKm: 461,
        batteryCapacityKwh: 50.3,
        chargingTimeHours: 8,
        topSpeedKmh: 140,
        seatingCapacity: 5,
        bodyType: 'SUV',
        location: 'Thane, Maharashtra',
        features: ['Certified Pre-Owned', 'Zero Accident History', 'Insurance Valid'],
        images: ['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80'],
        catKey: 'suv',
        isFeatured: false,
        status: 'PENDING_APPROVAL',
      },
    ];

    const seededVehicles = [];
    for (let idx = 0; idx < rawVehicles.length; idx++) {
      const vData = rawVehicles[idx];
      // Distribute vehicles evenly across the 10 demo vendors
      const assignedVendor = createdVendors[idx % createdVendors.length];

      const v = await Vehicle.create({
        title: vData.title,
        brand: vData.brand,
        model: vData.model,
        year: vData.year,
        price: vData.price,
        description: `${vData.brand} ${vData.model} (${vData.year}) Electric Vehicle with ${vData.rangeKm} km claimed battery range. Certified inspection completed.`,
        condition: vData.condition,
        mileage: vData.mileage || 0,
        rangeKm: vData.rangeKm,
        batteryCapacityKwh: vData.batteryCapacityKwh,
        chargingTimeHours: vData.chargingTimeHours,
        topSpeedKmh: vData.topSpeedKmh,
        seatingCapacity: vData.seatingCapacity,
        bodyType: vData.bodyType,
        location: vData.location,
        features: vData.features,
        images: vData.images,
        vendor: assignedVendor._id,
        category: catMap[vData.catKey] || categories[0]._id,
        status: vData.status,
        stock: vData.condition === 'NEW' ? 3 : 1,
        isFeatured: vData.isFeatured || false,
        ratingsAverage: 4.5 + (idx % 5) * 0.1,
        ratingsQuantity: 8 + (idx % 12),
      });

      seededVehicles.push(v);
    }

    console.log(`Successfully seeded ${seededVehicles.length} Vehicles across 10 Vendors.`);

    console.log('Creating Seed Orders & Verified Reviews...');
    const sampleOrder = await Order.create({
      orderNumber: 'EV-ORD-2026-9081',
      customer: customerUser._id,
      items: [
        {
          vehicle: seededVehicles[0]._id,
          title: seededVehicles[0].title,
          brand: seededVehicles[0].brand,
          model: seededVehicles[0].model,
          image: seededVehicles[0].images[0],
          quantity: 1,
          price: seededVehicles[0].price,
          vendor: seededVehicles[0].vendor,
        },
      ],
      shippingAddress: {
        name: customerUser.name,
        phone: customerUser.phone,
        email: customerUser.email,
        street: '42 Green Park Extension',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110016',
      },
      paymentInfo: {
        id: 'pi_stripe_seed_order_1',
        status: 'PAID',
        method: 'STRIPE',
        paidAt: new Date(),
      },
      pricing: {
        subtotal: seededVehicles[0].price,
        tax: Math.round(seededVehicles[0].price * 0.05),
        deliveryFee: 15000,
        totalPrice: seededVehicles[0].price + Math.round(seededVehicles[0].price * 0.05) + 15000,
      },
      orderStatus: 'DELIVERED',
      statusHistory: [
        { status: 'PENDING', description: 'Order created' },
        { status: 'CONFIRMED', description: 'Payment verified' },
        { status: 'SHIPPED', description: 'Vehicle dispatched via flatbed transporter' },
        { status: 'DELIVERED', description: 'Delivered to customer doorstep' },
      ],
    });

    await Review.create({
      vehicle: seededVehicles[0]._id,
      user: customerUser._id,
      order: sampleOrder._id,
      rating: 5,
      comment: 'Excellent range and comfortable for daily city driving. Real world battery efficiency is fantastic.',
    });

    console.log('✅ Database Seeding Completed Successfully!');
    console.log('----------------------------------------------------');
    console.log('DEMO ACCOUNTS CREATED:');
    console.log('1. Admin:    admin@evmarketplace.com    / Password123');
    console.log('2. Customer: customer@gmail.com         / Password123');
    console.log('3. Vendor:   voltdrive.demo@example.com / Password123');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
