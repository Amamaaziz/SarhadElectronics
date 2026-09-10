import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for Sarhad Electrics...');

  // 1. Seed Admin & Demo Customer
  const passwordHash = await bcrypt.hash('Admin123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@sarhadelectrics.com' },
    update: {},
    create: {
      fullName: 'Sarhad Admin',
      email: 'admin@sarhadelectrics.com',
      passwordHash,
      role: 'ADMIN',
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: 'user@sarhadelectrics.com' },
    update: {},
    create: {
      fullName: 'Ahmad Khan',
      email: 'user@sarhadelectrics.com',
      passwordHash,
      role: 'USER',
    },
  });

  console.log(`👤 Users seeded: Admin (${admin.email}), User (${demoUser.email})`);

  // 2. Seed Categories
  const categories = [
    { name: 'Smart Gadgets', slug: 'smart-gadgets', description: 'Wearables, audio gears & intelligent personal gadgets' },
    { name: 'Modern Lighting', slug: 'modern-lighting', description: 'Futuristic architectural & ambient neon lighting systems' },
    { name: 'Home Appliances', slug: 'home-appliances', description: 'Smart high-efficiency living and climate control appliances' },
    { name: 'Electrical Tools', slug: 'electrical-tools', description: 'Precision industrial multimeters, drills, and hardware' },
  ];

  const categoryMap = new Map<string, string>();

  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryMap.set(cat.slug, created.id);
  }
  console.log(`📁 Categories seeded: ${categories.length}`);

  // 3. Seed Products
  const products = [
    {
      name: 'Aura Noise Cancelling Pro',
      slug: 'aura-noise-cancelling-pro',
      description: 'Flagship spatial audio wireless headphones featuring active hybrid noise cancellation, 40-hour battery life, and ultra-plush memory foam comfort.',
      price: 249.99,
      stock: 45,
      categoryId: categoryMap.get('smart-gadgets')!,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      featured: true,
      rating: 4.9,
      reviewsCount: 128,
      brand: 'Bose',
    },
    {
      name: 'CyberPulse Neo Smartwatch X',
      slug: 'cyberpulse-neo-smartwatch-x',
      description: 'Futuristic aerospace titanium smartwatch with AMOLED display, ECG cardiac monitoring, 100+ fitness modes, and 14-day standby.',
      price: 189.50,
      stock: 30,
      categoryId: categoryMap.get('smart-gadgets')!,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      featured: true,
      rating: 4.8,
      reviewsCount: 94,
      brand: 'Samsung',
    },
    {
      name: 'Lumix RGB Smart Ambient Hex Bar',
      slug: 'lumix-rgb-smart-ambient-hex-bar',
      description: 'Dynamic reactive lighting bars with 16 million colors, sound synchronization, and WiFi Alexa/Google Home voice integration.',
      price: 89.00,
      stock: 60,
      categoryId: categoryMap.get('modern-lighting')!,
      imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
      featured: true,
      rating: 4.7,
      reviewsCount: 76,
      brand: 'Philips',
    },
    {
      name: 'Vortex Inverter Air Purifier Pro',
      slug: 'vortex-inverter-air-purifier-pro',
      description: 'Medical-grade H13 True HEPA multi-stage filtration system with laser particle sensor and whisper-quiet brushless DC motor.',
      price: 299.00,
      stock: 18,
      categoryId: categoryMap.get('home-appliances')!,
      imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80',
      featured: false,
      rating: 4.9,
      reviewsCount: 52,
      brand: 'Dyson',
    },
    {
      name: 'VoltMaster 20V Brushless Cordless Drill',
      slug: 'voltmaster-20v-brushless-cordless-drill',
      description: 'Industrial-grade dual-speed 20V hammer drill with 65Nm torque, magnetic bit holder, and 2x 4.0Ah lithium battery packs.',
      price: 159.00,
      stock: 25,
      categoryId: categoryMap.get('electrical-tools')!,
      imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80',
      featured: true,
      rating: 5.0,
      reviewsCount: 88,
      brand: 'Sarhad Heavy-Duty',
    },
    {
      name: 'AeroGlide Robotic Vacuum & Mop',
      slug: 'aeroglide-robotic-vacuum-mop',
      description: 'LiDAR precision navigation robot with 5000Pa suction, auto-empty dustbin station, and sonic floor scrub technology.',
      price: 499.00,
      stock: 14,
      categoryId: categoryMap.get('home-appliances')!,
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
      featured: false,
      rating: 4.8,
      reviewsCount: 41,
      brand: 'LG',
    },
    {
      name: 'TrueRMS Digital Clamp Multimeter Pro',
      slug: 'truerms-digital-clamp-multimeter-pro',
      description: '6000-count auto-ranging multimeter with NCV non-contact AC voltage sensor, temperature probe, and backlit OLED screen.',
      price: 65.00,
      stock: 40,
      categoryId: categoryMap.get('electrical-tools')!,
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
      featured: false,
      rating: 4.9,
      reviewsCount: 63,
      brand: 'Sarhad Tools',
    },
  ];

  for (const prod of products) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: prod,
    });
  }
  console.log(`⚡ Products seeded: ${products.length}`);
  console.log('✅ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

