import { LegacyProduct } from '../types/Product';

export const products: LegacyProduct[] = [
  {
    id: '1',
    name: 'Premium Ceiling Fan',
    category: 'Fans',
    subCategory: 'Ceiling Fans',
    price: 129.99,
    description: 'High-quality ceiling fan with 3-speed control and remote operation',
    imageUrl: 'https://picsum.photos/800/600?random=1',
    images: [
      'https://picsum.photos/800/600?random=1',
      'https://picsum.photos/800/600?random=2',
      'https://picsum.photos/800/600?random=3'
    ],
    specifications: {
      'Power': '65W',
      'Blade Span': '52 inches',
      'Air Flow': '5200 CFM',
      'Material': 'Steel/Wood',
      'Warranty': '2 years'
    },
    popularity: 4.7
  },
  {
    id: '2',
    name: 'Modern Table Fan',
    category: 'Fans',
    subCategory: 'Table Fans',
    price: 49.99,
    description: 'Compact and powerful table fan with oscillation feature',
    imageUrl: 'https://picsum.photos/1440/900?random=2',
    images: [
      'https://picsum.photos/1440/900?random=2',
      'https://picsum.photos/1920/1080?random=2a',
      'https://picsum.photos/1280/720?random=2b'
    ],
    specifications: {
      'Speed Settings': '3',
      'Size': '16 inches',
      'Power': '55W'
    },
    popularity: 4.2
  },
  {
    id: '3',
    name: 'Smart LED Bulb Pack',
    category: 'Lighting',
    subCategory: 'Bulbs',
    price: 39.99,
    description: 'Pack of 4 smart LED bulbs with app control',
    imageUrl: 'https://picsum.photos/1920/1080?random=3',
    images: [
      'https://picsum.photos/1920/1080?random=3',
      'https://picsum.photos/1600/900?random=3a',
      'https://picsum.photos/1440/900?random=3b'
    ],
    specifications: {
      'Wattage': '9W',
      'Lumens': '800',
      'Color Temperature': '2700K-6500K'
    },
    popularity: 4.8
  },
  {
    id: '4',
    name: 'RGB LED Strip',
    category: 'Lighting',
    subCategory: 'LED Strips',
    price: 24.99,
    description: '5m RGB LED strip with remote control',
    imageUrl: 'https://picsum.photos/1280/720?random=4',
    images: [
      'https://picsum.photos/1920/1080?random=4',
      'https://picsum.photos/1280/720?random=4a',
      'https://picsum.photos/1440/900?random=4b'
    ],
    specifications: {
      'Length': '5m',
      'LED Count': '150',
      'Power Supply': '12V'
    },
    popularity: 4.3
  },
  {
    id: '5',
    name: 'Smart Wall Switch',
    category: 'Electrical Supplies',
    subCategory: 'Switches',
    price: 29.99,
    description: 'WiFi-enabled smart wall switch with voice control',
    imageUrl: 'https://picsum.photos/1280/720?random=5',
    images: [
      'https://picsum.photos/1920/1080?random=5',
      'https://picsum.photos/1280/720?random=5a',
      'https://picsum.photos/1440/900?random=5b'
    ],
    specifications: {
      'Rating': '15A',
      'WiFi': '2.4GHz',
      'Voice Control': 'Alexa & Google Home'
    },
    popularity: 4.6
  },
  {
    id: '6',
    name: 'Surge Protector',
    category: 'Electrical Supplies',
    subCategory: 'Extension Cords',
    price: 34.99,
    description: '8-outlet surge protector with USB ports',
    imageUrl: 'https://picsum.photos/1280/720?random=6',
    images: [
      'https://picsum.photos/1920/1080?random=6',
      'https://picsum.photos/1280/720?random=6a',
      'https://picsum.photos/1440/900?random=6b'
    ],
    specifications: {
      'Outlets': '8',
      'USB Ports': '4',
      'Cord Length': '6ft'
    },
    popularity: 4.7
  },
  {
    id: '7',
    name: 'Professional Screwdriver Set',
    category: 'Tools',
    subCategory: 'Screwdrivers',
    price: 45.99,
    description: '12-piece precision screwdriver set with magnetic tips',
    imageUrl: 'https://picsum.photos/1280/720?random=7',
    images: [
      'https://picsum.photos/1920/1080?random=7',
      'https://picsum.photos/1280/720?random=7a',
      'https://picsum.photos/1440/900?random=7b'
    ],
    specifications: {
      'Pieces': '12',
      'Material': 'Chrome Vanadium',
      'Handle': 'Ergonomic Grip'
    },
    popularity: 4.4
  },
  {
    id: '8',
    name: 'Digital Multimeter',
    category: 'Tools',
    subCategory: 'Basic Testing Equipment',
    price: 79.99,
    description: 'Professional digital multimeter with auto-ranging',
    imageUrl: 'https://picsum.photos/1280/720?random=8',
    images: [
      'https://picsum.photos/1920/1080?random=8',
      'https://picsum.photos/1280/720?random=8a',
      'https://picsum.photos/1440/900?random=8b'
    ],
    specifications: {
      'Display': 'LCD',
      'Measurements': 'Voltage, Current, Resistance',
      'Safety Rating': 'CAT III'
    },
    popularity: 4.9
  },
  {
    id: '9',
    name: 'Wireless Doorbell',
    category: 'Electrical Supplies',
    subCategory: 'Switches',
    price: 25.99,
    description: 'Modern wireless doorbell with 52 chimes and LED indicator',
    imageUrl: 'https://picsum.photos/1280/720?random=9',
    images: [
      'https://picsum.photos/1920/1080?random=9',
      'https://picsum.photos/1280/720?random=9a',
      'https://picsum.photos/1440/900?random=9b'
    ],
    specifications: {
      'Range': '300m',
      'Chimes': '52',
      'Power': 'Battery/USB',
      'Waterproof': 'IP44'
    },
    popularity: 4.3
  }
]; 