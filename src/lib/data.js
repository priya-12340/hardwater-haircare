export const products = [
  {
    id: 'p_001',
    slug: 'hard-water-shampoo',
    name: 'Hard Water Shampoo',
    category: 'shampoo',
    sizeMl: 200,
    price: 799,
    mrp: 999,
    stock: 25,
    rating: 4.5,
    reviewCount: 23,
    image: '/images/product-1.png',
    shortDescription: 'A gentle cleanse designed to help remove mineral buildup.',
    description:
      'A thoughtful wash-day essential for hair that can feel coated or dull after hard-water exposure. Formulated to help lift mineral residue while keeping your routine simple.',
    keyPoints: [
      'Helps remove mineral buildup',
      'A fresh, clean-rinsing wash',
      'Made for a balanced wash-day routine',
    ],
    ingredients: [
      ['Sodium gluconate', 'Helps bind minerals so they can rinse away'],
      ['Glycerin', 'Helps attract and retain moisture'],
      ['Panthenol', 'A conditioning ingredient used in hair care'],
    ],
    usage: {
      frequency: 'Use as directed on the final product label',
      amount: 'Start with a coin-sized amount and adjust to hair length',
      steps: [
        'Wet hair thoroughly',
        'Massage gently through the scalp and lengths',
        'Rinse well; follow with conditioner',
      ],
    },
  },
  {
    id: 'p_002',
    slug: 'hard-water-conditioner',
    name: 'Daily Softening Conditioner',
    category: 'rinse',
    sizeMl: 200,
    price: 749,
    mrp: 899,
    stock: 18,
    rating: 4.4,
    reviewCount: 9,
    image: '/images/product-2.png',
    shortDescription: 'A softening finish for smoother-feeling lengths.',
    description:
      'A comforting conditioner designed to complement a clarifying wash and leave lengths feeling easier to manage.',
    keyPoints: [
      'Softens the feel of lengths',
      'Pairs with a clarifying routine',
      'Easy everyday rinse-out care',
    ],
    ingredients: [
      ['Cetearyl alcohol', 'Helps give conditioner its creamy texture'],
      ['Glycerin', 'Helps attract moisture'],
      ['Behentrimonium chloride', 'A conditioning agent that helps detangle'],
    ],
    usage: {
      frequency: 'After shampooing',
      amount: 'Apply through mid-lengths and ends',
      steps: [
        'Squeeze out excess water',
        'Work through mid-lengths and ends',
        'Leave briefly and rinse thoroughly',
      ],
    },
  },
  {
    id: 'p_003',
    slug: 'complete-haircare-bundle',
    name: 'Complete Haircare Bundle',
    category: 'bundle',
    sizeMl: 400,
    price: 1499,
    mrp: 1899,
    stock: 12,
    rating: 4.6,
    reviewCount: 12,
    image: '/images/product-3.png',
    shortDescription: 'A simple two-step routine for a fresh start.',
    description:
      'Pair the hard-water shampoo with a softening conditioner for a complete wash-day routine.',
    keyPoints: [
      'Two-step wash-day pairing',
      'Great-value routine set',
      'A thoughtful haircare gift',
    ],
    ingredients: [['Shampoo + conditioner', 'See individual product details']],
    usage: {
      frequency: 'Follow each product label',
      amount: 'Use each product as directed',
      steps: ['Cleanse with shampoo', 'Rinse thoroughly', 'Condition lengths and rinse'],
    },
  },
  {
    id: 'p_004',
    slug: 'mineral-rinse',
    name: 'Mineral Reset Rinse',
    category: 'rinse',
    sizeMl: 150,
    price: 599,
    mrp: 699,
    stock: 7,
    rating: 4.2,
    reviewCount: 6,
    image: '/images/product-2.png',
    shortDescription: 'A rinse-step addition for occasional reset days.',
    description:
      'An occasional rinse step designed to complement your haircare routine. Follow the final label for frequency and suitability.',
    keyPoints: ['A focused rinse step', 'Designed to complement shampoo', 'Clear usage guidance'],
    ingredients: [['Sodium gluconate', 'Helps bind minerals']],
    usage: {
      frequency: 'As directed on label',
      amount: 'As directed on label',
      steps: ['Read the final label', 'Apply as directed', 'Rinse thoroughly'],
    },
  },
];
export const reviews = [
  {
    id: 'r1',
    rating: 5,
    title: 'A lighter feel',
    text: 'My hair feels less coated after wash day. I like that the instructions are simple.',
    date: '2026-11-10',
    verified: false,
    source: 'Sample review',
  },
  {
    id: 'r2',
    rating: 4,
    title: 'Nice texture',
    text: 'Easy to use and the conditioner leaves my lengths feeling soft.',
    date: '2026-10-28',
    verified: false,
    source: 'Sample review',
  },
  {
    id: 'r3',
    rating: 4,
    title: 'Part of my routine',
    text: 'A pleasant product. I am still figuring out the right frequency for my hair.',
    date: '2026-10-12',
    verified: false,
    source: 'Sample review',
  },
];
export const money = (n) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);
export const per100 = (price, size) => (size ? Math.round((price / size) * 100) : null);
export const discount = (mrp, price) => (mrp > price ? Math.floor(((mrp - price) / mrp) * 100) : 0);
export const calculateTotals = (items, code = '') => {
  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const discountAmount = code.trim().toUpperCase() === 'WELCOME10' ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal - discountAmount >= 999 || subtotal === 0 ? 0 : 79;
  return {
    subtotal,
    discount: discountAmount,
    shipping,
    total: subtotal - discountAmount + shipping,
  };
};
