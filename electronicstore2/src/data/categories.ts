// Define a local category interface for the static data
interface LocalCategory {
  name: string;
  subCategories: string[];
  imageUrl?: string;
}

// Local categories data
export const categories: LocalCategory[] = [
  {
    name: 'Fans',
    subCategories: ['Ceiling Fans', 'Table Fans'],
    imageUrl: 'https://picsum.photos/400/300?random=10'
  },
  {
    name: 'Lighting',
    subCategories: ['Bulbs', 'LED Strips'],
    imageUrl: 'https://picsum.photos/400/300?random=11'
  },
  {
    name: 'Electrical Supplies',
    subCategories: ['Switches', 'Sockets', 'Extension Cords'],
    imageUrl: 'https://picsum.photos/400/300?random=12'
  },
  {
    name: 'Tools',
    subCategories: ['Screwdrivers', 'Insulation Tapes', 'Basic Testing Equipment'],
    imageUrl: 'https://picsum.photos/400/300?random=13'
  }
]; 