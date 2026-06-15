import { 
  Category, Product, Topping, Table, TableStatus, Order, OrderItem, Coupon, Customer, User, OrderStatus, PaymentMethod, SystemSettings
} from '../types';

// Let's define the local storage keys
const STORAGE_KEYS = {
  CATEGORIES: 'pos_categories',
  PRODUCTS: 'pos_products',
  TOPPINGS: 'pos_toppings',
  TABLES: 'pos_tables',
  ORDERS: 'pos_orders',
  ORDER_ITEMS: 'pos_order_items',
  ORDER_ITEM_TOPPINGS: 'pos_order_item_toppings',
  COUPONS: 'pos_coupons',
  CUSTOMERS: 'pos_customers',
  USERS: 'pos_users',
  CURRENT_USER_ID: 'pos_current_user_id',
  DARK_MODE: 'pos_dark_mode',
  LANGUAGE: 'pos_lang',
  SYSTEM_SETTINGS: 'pos_system_settings'
};

// Seeding standard data helper
function getOrSeed<T>(key: string, defaultData: T): T {
  const existing = localStorage.getItem(key);
  if (existing) {
    try {
      return JSON.parse(existing) as T;
    } catch (e) {
      console.error(`Error parsing key ${key}`, e);
    }
  }
  localStorage.setItem(key, JSON.stringify(defaultData));
  return defaultData;
}

// Default Seed Data
const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Classic Pizzas', icon: '🍕', sort_order: 1, active: true },
  { id: 'cat-2', name: 'Starters', icon: '🍟', sort_order: 2, active: true },
  { id: 'cat-3', name: 'Desserts', icon: '🍰', sort_order: 3, active: true },
  { id: 'cat-4', name: 'Drinks', icon: '🥤', sort_order: 4, active: true },
  { id: 'cat-5', name: 'Canned Beverages', icon: '🥫', sort_order: 5, active: true },
  { id: 'cat-6', name: 'Extra', icon: '🌶️', sort_order: 6, active: true }
];

const DEFAULT_PRODUCTS: Product[] = [
  // Pizzas
  {
    id: 'prod-1',
    category_id: 'cat-1',
    name: 'Capricciosa Pizza',
    description: 'Delectable classic loaded with tomato sauce, mozzarella cheese, Italian ham, fresh mushrooms, black olives, and green artichokes.',
    small_price: 10.00,
    medium_price: 14.50,
    large_price: 18.00,
    image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=400&q=80',
    popular: true,
    discount_percent: 15,
    rating: 4.8,
    active: true,
    badge: 'Best Seller',
    created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'prod-2',
    category_id: 'cat-1',
    name: 'Margherita Dream',
    description: 'Simplicity at its best. Authentically cooked pizza topped with rich San Marzano tomato sauce, fresh creamy mozzarella, aromatic organic basil leaves, and high-grade extra virgin olive oil.',
    small_price: 8.00,
    medium_price: 11.00,
    large_price: 14.00,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=400&q=80',
    popular: true,
    discount_percent: 0,
    rating: 4.9,
    active: true,
    badge: 'Classic',
    created_at: new Date(Date.now() - 28 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'prod-3',
    category_id: 'cat-1',
    name: 'Double Pepperoni Feast',
    description: 'Hot pizza topped with dual portions of spicy, crispy pepperoni slices, whole-milk mozzarella cheese, and our signature slow-simmered marinara sauce.',
    small_price: 11.00,
    medium_price: 15.00,
    large_price: 19.00,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=400&q=80',
    popular: true,
    discount_percent: 10,
    rating: 4.7,
    active: true,
    badge: 'Popular',
    created_at: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'prod-4',
    category_id: 'cat-1',
    name: 'Four Cheese (Quattro Formaggi)',
    description: 'Indulgent white pizza topped with a premium, savory blend of Gorgonzola blue cheese, sharp Parmesan, melted creamy Fontina, and mozzarella.',
    small_price: 12.00,
    medium_price: 16.50,
    large_price: 21.00,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
    popular: false,
    discount_percent: 0,
    rating: 4.6,
    active: true,
    created_at: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString()
  },
  // Starters
  {
    id: 'prod-5',
    category_id: 'cat-2',
    name: 'Herby Garlic Bread',
    description: 'Freshly baked classic French baguette slices brushed with minced garlic, premium butter, organic parsley, rosemary, and baked to perfection with a light cheese layer.',
    small_price: 4.00,
    medium_price: 5.50,
    large_price: 7.00,
    image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=400&q=80',
    popular: false,
    discount_percent: 0,
    rating: 4.5,
    active: true,
    created_at: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'prod-6',
    category_id: 'cat-2',
    name: 'Crispy Mozzarella Sticks',
    description: 'Golden-fried breaded real mozzarella cheese sticks. Wonderfully crunchy on the outside, bubbly hot on the inside. Served with warm marinara dipping sauce.',
    small_price: 5.00,
    medium_price: 6.50,
    large_price: 8.00,
    image: 'https://images.unsplash.com/photo-1531749668029-2db88e4b76ce?auto=format&fit=crop&w=400&q=80',
    popular: true,
    discount_percent: 0,
    rating: 4.6,
    active: true,
    badge: 'Popular',
    created_at: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'prod-7',
    category_id: 'cat-2',
    name: 'Spicy Buffalo BBQ Wings',
    description: 'Juicy, dynamic chicken wings tossed in your choice of zesty Buffalo hot sauce or rich honey BBQ sauce, accompanied with blue cheese dip.',
    small_price: 6.00,
    medium_price: 8.00,
    large_price: 10.00,
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=400&q=80',
    popular: true,
    discount_percent: 5,
    rating: 4.7,
    active: true,
    badge: 'Hot',
    created_at: new Date().toISOString()
  },
  // Desserts
  {
    id: 'prod-8',
    category_id: 'cat-3',
    name: 'Classic Espresso Tiramisu',
    description: 'Decadent layered Italian cake made with sweet coffee-soaked ladyfingers, rich mascarpone cream frosting, and fine Belgian cocoa powder dusting.',
    small_price: 5.00,
    medium_price: 6.50,
    large_price: 8.00,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=400&q=80',
    popular: true,
    discount_percent: 0,
    rating: 4.9,
    active: true,
    badge: 'Premium',
    created_at: new Date(Date.now() - 40 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'prod-9',
    category_id: 'cat-3',
    name: 'Decadent Chocolate Lava Cake',
    description: 'Bite into real luxury. Baked chocolate cake featuring an intensely rich, molten hot liquid fudge center. Served with creamy vanilla bean gelato.',
    small_price: 6.00,
    medium_price: 8.00,
    large_price: 10.00,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400&q=80',
    popular: true,
    discount_percent: 10,
    rating: 4.8,
    active: true,
    created_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
  },
  // Drinks
  {
    id: 'prod-10',
    category_id: 'cat-4',
    name: 'Freshly Pressed Orange Juice',
    description: 'Zesty, vitamin-C rich fresh juice cold-pressed from premium sweet Valencia oranges, prepared fresh to order. No sugar added.',
    small_price: 3.00,
    medium_price: 4.00,
    large_price: 5.00,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=400&q=80',
    popular: false,
    discount_percent: 0,
    rating: 4.2,
    active: true,
    created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'prod-11',
    category_id: 'cat-4',
    name: 'Artisanal Cold Latte',
    description: 'Smooth, double shot of house-roasted espresso shaken over ice cubes with local creamy milk, topped with a micro-foam layer.',
    small_price: 3.50,
    medium_price: 4.50,
    large_price: 5.50,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=400&q=80',
    popular: true,
    discount_percent: 0,
    rating: 4.6,
    active: true,
    created_at: new Date().toISOString()
  },
  // Canned
  {
    id: 'prod-12',
    category_id: 'cat-5',
    name: 'Coca Cola Original',
    description: 'Chilled 330ml aluminum can of the worlds favorite classic sparkling sweet soda beverage. Served with ice.',
    small_price: 2.00,
    medium_price: 2.50,
    large_price: 3.00,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
    popular: false,
    discount_percent: 0,
    rating: 4.1,
    active: true,
    created_at: new Date(Date.now() - 100 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'prod-13',
    category_id: 'cat-5',
    name: 'Pepsi Ice Chill',
    description: 'Chilled 330ml aluminum can of Pepsi-cola. Served with glass of ice and citrus lemon slice.',
    small_price: 2.00,
    medium_price: 2.50,
    large_price: 3.00,
    image: 'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=400&q=80',
    popular: false,
    discount_percent: 0,
    rating: 4.0,
    active: true,
    created_at: new Date(Date.now() - 90 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'prod-14',
    category_id: 'cat-5',
    name: 'Sprite Lemon Lime',
    description: 'Refreshing, caffeine-free lime soda beverage served in ice-cold classic canned condition.',
    small_price: 2.00,
    medium_price: 2.50,
    large_price: 3.00,
    image: 'https://images.unsplash.com/photo-1625772291427-39f585a24e81?auto=format&fit=crop&w=400&q=80',
    popular: false,
    discount_percent: 0,
    rating: 4.1,
    active: true,
    created_at: new Date(Date.now() - 85 * 24 * 3600 * 1000).toISOString()
  },
  // Extras
  {
    id: 'prod-15',
    category_id: 'cat-6',
    name: 'House Creamy Garlic Mayo',
    description: 'Smooth, luxurious house-emulsified mayonnaise enriched with crushed fresh garlic Cloves and French herbs.',
    small_price: 1.00,
    medium_price: 1.25,
    large_price: 1.50,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    popular: false,
    discount_percent: 0,
    rating: 4.5,
    active: true,
    created_at: new Date(Date.now() - 50 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'prod-16',
    category_id: 'cat-6',
    name: 'Spicy Hot Buffalo Drizzle',
    description: 'Blazing-hot, authentic cayenne pepper, vinegar, and garlic sauce for pizza crusts and starter dippings.',
    small_price: 1.00,
    medium_price: 1.25,
    large_price: 1.50,
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=400&q=80',
    popular: false,
    discount_percent: 0,
    rating: 4.4,
    active: true,
    created_at: new Date(Date.now() - 48 * 24 * 3600 * 1000).toISOString()
  }
];

const DEFAULT_TOPPINGS: Topping[] = [
  { id: 'top-1', name: 'Pepperoni Slices', price: 1.50, image: '🍕', active: true },
  { id: 'top-2', name: 'Italian Sausage', price: 2.00, image: '🍖', active: true },
  { id: 'top-3', name: 'Grilled Chicken', price: 2.25, image: '🍗', active: true },
  { id: 'top-4', name: 'Smoked Bacon Crumbles', price: 2.00, image: '🥓', active: true },
  { id: 'top-5', name: 'Extra Mozzarella Cheese', price: 1.75, image: '🧀', active: true },
  { id: 'top-6', name: 'Sliced Button Mushrooms', price: 1.25, image: '🍄', active: true },
  { id: 'top-7', name: 'Kalamata Black Olives', price: 1.00, image: '🫒', active: true },
  { id: 'top-8', name: 'Shredded Red Onion', price: 0.75, image: '🧅', active: true }
];

const DEFAULT_TABLES: Table[] = ((): Table[] => {
  const list: Table[] = [];
  for (let i = 1; i <= 50; i++) {
    // distribute statuses to look realistic of a restaurant
    let status: TableStatus = 'Available';
    if (i === 2 || i === 5 || i === 8 || i === 12 || i === 25) {
      status = 'Occupied';
    } else if (i === 1 || i === 15 || i === 30 || i === 44) {
      status = 'Reserved';
    }
    list.push({
      id: `table-id-${i}`,
      table_number: `T-${i}`,
      capacity: i % 4 === 0 ? 6 : i % 2 === 0 ? 4 : 2,
      status,
      active: true
    });
  }
  return list;
})();

const DEFAULT_COUPONS: Coupon[] = [
  { id: 'coup-1', code: 'PIZZA20', type: 'percent', value: 20, active: true, expire_date: '2027-12-31T23:59:59Z' },
  { id: 'coup-2', code: 'HELLO5', type: 'fixed', value: 5.00, active: true, expire_date: '2027-12-31T23:59:59Z' },
  { id: 'coup-3', code: 'VIPFREE', type: 'percent', value: 100, active: true, expire_date: '2027-12-31T23:59:59Z' },
  { id: 'coup-4', code: 'SAVEMORE', type: 'fixed', value: 12.00, active: true, expire_date: '2027-12-31T23:59:59Z' }
];

const DEFAULT_CUSTOMERS: Customer[] = [
  { id: 'cust-1', name: 'Sok Mean', phone: '012345678', email: 'sokmean@example.com', points: 1540, visits: 22 },
  { id: 'cust-2', name: 'Chan Sol', phone: '098765432', email: 'chansol@example.com', points: 850, visits: 12 },
  { id: 'cust-3', name: 'Emily Carter', phone: '071223344', email: 'emily@example.com', points: 210, visits: 3 },
  { id: 'cust-4', name: 'David Kim', phone: '010556677', email: 'david@example.com', points: 3450, visits: 48 },
  { id: 'cust-5', name: 'Sreypich Meas', phone: '012998877', email: 'sreypich@example.com', points: 60, visits: 1 }
];

const DEFAULT_USERS: User[] = [
  { id: 'user-admin', name: 'Senghakk (Admin)', role: 'Admin', active: true },
  { id: 'user-manager', name: 'Dara (Manager)', role: 'Manager', active: true },
  { id: 'user-cashier', name: 'Sophea (Cashier)', role: 'Cashier', active: true },
  { id: 'user-kitchen', name: 'Chef Makara (Kitchen)', role: 'Kitchen', active: true },
  { id: 'user-waiter', name: 'Narith (Waiter)', role: 'Waiter', active: true }
];

// Historical order seeding to populate beautiful analytics dashboard instantly
const DEFAULT_ORDERS: { orders: Order[], items: OrderItem[] } = ((): { orders: Order[], items: OrderItem[] } => {
  const oList: Order[] = [];
  const iList: OrderItem[] = [];
  const times = [
    { hrsAgo: 1, method: 'KHQR', table: 2, total: 32.50, status: 'Preparing' as OrderStatus },
    { hrsAgo: 2, method: 'ABA Pay', table: 5, total: 18.00, status: 'Preparing' as OrderStatus },
    { hrsAgo: 3, method: 'Card', table: 8, total: 42.00, status: 'Pending' as OrderStatus },
    { hrsAgo: 5, method: 'Cash', table: 12, total: 24.50, status: 'Completed' as OrderStatus },
    { hrsAgo: 8, method: 'KHQR', table: 25, total: 68.00, status: 'Completed' as OrderStatus },
    // Historical items over past 24 hours of standard operations
    { hrsAgo: 10, method: 'KHQR', table: 3, total: 28.00, status: 'Completed' as OrderStatus },
    { hrsAgo: 14, method: 'Card', table: 4, total: 110.00, status: 'Completed' as OrderStatus },
    { hrsAgo: 18, method: 'ABA Pay', table: 6, total: 45.00, status: 'Completed' as OrderStatus },
    { hrsAgo: 20, method: 'Cash', table: 9, total: 15.50, status: 'Completed' as OrderStatus },
    { hrsAgo: 23, method: 'ACLEDA', table: 10, total: 38.00, status: 'Completed' as OrderStatus },
    // Past few days
    { hrsAgo: 30, method: 'Wing', table: 14, total: 54.00, status: 'Completed' as OrderStatus },
    { hrsAgo: 45, method: 'KHQR', table: 18, total: 82.00, status: 'Completed' as OrderStatus },
    { hrsAgo: 60, method: 'Card', table: 22, total: 125.00, status: 'Completed' as OrderStatus },
    { hrsAgo: 90, method: 'ABA Pay', table: 11, total: 45.00, status: 'Completed' as OrderStatus },
    { hrsAgo: 120, method: 'Cash', table: 16, total: 60.50, status: 'Completed' as OrderStatus }
  ];

  times.forEach((t, index) => {
    const oId = `ord-hist-${index}`;
    const date = new Date(Date.now() - t.hrsAgo * 3600 * 1000).toISOString();
    
    // Core attributes
    const num = `POS-${1000 + index}`;
    const subtotal = Number((t.total * 0.9).toFixed(2));
    const tax = Number((subtotal * 0.1).toFixed(2));
    
    oList.push({
      id: oId,
      order_number: num,
      table_id: `table-id-${t.table}`,
      customer_id: index % 2 === 0 ? 'cust-1' : 'cust-2',
      status: t.status,
      subtotal,
      discount: 0,
      tax,
      total: t.total,
      payment_method: t.method as PaymentMethod,
      created_by: 'user-cashier',
      created_at: date
    });

    // Dummy order item
    iList.push({
      id: `ord-it-hist-${index}`,
      order_id: oId,
      product_id: index % 2 === 0 ? 'prod-1' : 'prod-2',
      size: 'Medium',
      quantity: 2,
      price: Number((subtotal / 2).toFixed(2)),
      notes: 'Quick service'
    });
  });

  return { orders: oList, items: iList };
})();

// Active DB instance class that exposes standard mock collections and performs triggers matching Edge Functions
export class SupabaseLocalDatabase {
  categories: Category[];
  products: Product[];
  toppings: Topping[];
  tables: Table[];
  orders: Order[];
  orderItems: OrderItem[];
  coupons: Coupon[];
  customers: Customer[];
  users: User[];
  currentUserId: string;
  darkMode: boolean;
  language: string;
  systemSettings: SystemSettings;

  private watchers: (() => void)[] = [];

  constructor() {
    this.categories = getOrSeed(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    this.products = getOrSeed(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
    this.toppings = getOrSeed(STORAGE_KEYS.TOPPINGS, DEFAULT_TOPPINGS);
    this.tables = getOrSeed(STORAGE_KEYS.TABLES, DEFAULT_TABLES);
    this.orders = getOrSeed(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS.orders);
    this.orderItems = getOrSeed(STORAGE_KEYS.ORDER_ITEMS, DEFAULT_ORDERS.items);
    this.coupons = getOrSeed(STORAGE_KEYS.COUPONS, DEFAULT_COUPONS);
    this.customers = getOrSeed(STORAGE_KEYS.CUSTOMERS, DEFAULT_CUSTOMERS);
    this.users = getOrSeed(STORAGE_KEYS.USERS, DEFAULT_USERS);
    this.currentUserId = getOrSeed(STORAGE_KEYS.CURRENT_USER_ID, 'user-admin');
    this.darkMode = getOrSeed(STORAGE_KEYS.DARK_MODE, false);
    this.language = getOrSeed(STORAGE_KEYS.LANGUAGE, 'en');
    this.systemSettings = getOrSeed(STORAGE_KEYS.SYSTEM_SETTINGS, {
      currency: '€',
      fontSize: 'medium',
      fontFamily: 'Inter',
      taxPercent: 10,
      pointsPerSpent: 1,
      promoTitleEnglish: 'Capricciosa Pizza - 15% Off!',
      promoTitleKhmer: 'ភីហ្សា Capricciosa បញ្ចុះតម្លៃ ១៥%!',
      promoDescEnglish: 'Delicious artisanal classic loaded with ham, mushrooms, black olives, and premium mozzarella. Valid for all digital table-side checkouts today.',
      promoDescKhmer: 'រសជាតិឆ្ងាញ់ពិតៗ ជាមួយគ្រឿងផ្សំពិសេសជាច្រើនមុខ។ ផ្តល់ជូនសម្រាប់ការបញ្ជាទិញនៅថ្ងៃនេះទាំងអស់។'
    } as SystemSettings);
  }

  // Persists the current state
  private save(key: keyof typeof STORAGE_KEYS, value: any) {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
    this.notifyWatchers();
  }

  // Subscription Watchers for Multi-device/Tab syncing instantly
  subscribe(callback: () => void) {
    this.watchers.push(callback);
    return () => {
      this.watchers = this.watchers.filter(w => w !== callback);
    };
  }

  private notifyWatchers() {
    this.watchers.forEach(w => w());
  }

  // Theme settings and profile helpers
  setDarkMode(mode: boolean) {
    this.darkMode = mode;
    this.save('DARK_MODE', mode);
  }

  setLanguage(lang: string) {
    this.language = lang;
    this.save('LANGUAGE', lang);
  }

  setCurrentUser(userId: string) {
    this.currentUserId = userId;
    this.save('CURRENT_USER_ID', userId);
  }

  getSystemSettings(): SystemSettings {
    return this.systemSettings;
  }

  saveSystemSettings(settings: SystemSettings) {
    this.systemSettings = settings;
    this.save('SYSTEM_SETTINGS', settings);
  }

  // --- CRUD OPERATIONS PARALLELING SUPABASE QUERIES ---

  // Categories CRUD
  getCategories() { return this.categories; }
  saveCategory(cat: Category) {
    const idx = this.categories.findIndex(c => c.id === cat.id);
    if (idx >= 0) {
      this.categories[idx] = cat;
    } else {
      this.categories.push(cat);
    }
    this.save('CATEGORIES', this.categories);
  }
  deleteCategory(id: string) {
    this.categories = this.categories.filter(c => c.id !== id);
    this.save('CATEGORIES', this.categories);
  }

  // Products CRUD
  getProducts() { return this.products; }
  saveProduct(prod: Product) {
    const idx = this.products.findIndex(p => p.id === prod.id);
    if (idx >= 0) {
      this.products[idx] = prod;
    } else {
      this.products.push(prod);
    }
    this.save('PRODUCTS', this.products);
  }
  deleteProduct(id: string) {
    this.products = this.products.filter(p => p.id !== id);
    this.save('PRODUCTS', this.products);
  }

  // Toppings
  getToppings() { return this.toppings; }
  saveTopping(top: Topping) {
    const idx = this.toppings.findIndex(t => t.id === top.id);
    if (idx >= 0) {
      this.toppings[idx] = top;
    } else {
      this.toppings.push(top);
    }
    this.save('TOPPINGS', this.toppings);
  }

  // Tables
  getTables() { return this.tables; }
  updateTableStatus(id: string, status: TableStatus) {
    const idx = this.tables.findIndex(t => t.id === id);
    if (idx >= 0) {
      this.tables[idx].status = status;
      this.save('TABLES', this.tables);
    }
  }
  saveTable(table: Table) {
    const idx = this.tables.findIndex(t => t.id === table.id);
    if (idx >= 0) {
      this.tables[idx] = table;
    } else {
      this.tables.push(table);
    }
    this.save('TABLES', this.tables);
  }
  deleteTable(id: string) {
    this.tables = this.tables.filter(t => t.id !== id);
    this.save('TABLES', this.tables);
  }

  // Customers
  getCustomers() { return this.customers; }
  saveCustomer(cust: Customer) {
    const idx = this.customers.findIndex(c => c.id === cust.id);
    if (idx >= 0) {
      this.customers[idx] = cust;
    } else {
      this.customers.push(cust);
    }
    this.save('CUSTOMERS', this.customers);
  }
  deleteCustomer(id: string) {
    this.customers = this.customers.filter(c => c.id !== id);
    this.save('CUSTOMERS', this.customers);
  }

  // Coupons
  getCoupons() { return this.coupons; }
  saveCoupon(coupon: Coupon) {
    const idx = this.coupons.findIndex(c => c.id === coupon.id);
    if (idx >= 0) {
      this.coupons[idx] = coupon;
    } else {
      this.coupons.push(coupon);
    }
    this.save('COUPONS', this.coupons);
  }
  deleteCoupon(id: string) {
    this.coupons = this.coupons.filter(c => c.id !== id);
    this.save('COUPONS', this.coupons);
  }

  // Users
  getUsers() { return this.users; }

  // Orders
  getOrders() { return this.orders; }
  getOrderItems(orderId: string) { 
    return this.orderItems.filter(item => item.order_id === orderId); 
  }

  // Update order status directly
  updateOrderStatus(orderId: string, status: OrderStatus) {
    const idx = this.orders.findIndex(o => o.id === orderId);
    if (idx >= 0) {
      this.orders[idx].status = status;
      
      // If table is associated and order gets completed/cancelled, free up the table!
      const currentOrder = this.orders[idx];
      if (currentOrder.table_id && (status === 'Completed' || status === 'Cancelled')) {
        this.updateTableStatus(currentOrder.table_id, 'Available');
      } else if (currentOrder.table_id && status === 'Preparing') {
        this.updateTableStatus(currentOrder.table_id, 'Occupied');
      }

      this.save('ORDERS', this.orders);
    }
  }

  // --- SUPABASE EDGE FUNCTIONS SIMULATION ---

  /**
   * Edge Function: create-order
   * Responsible for establishing an order with transactional calculation of sums, discounts, and taxes.
   */
  edgeFunctionCreateOrder(params: {
    table_id: string | null;
    customer_id: string | null;
    items: {
      product_id: string;
      size: 'Small' | 'Medium' | 'Large';
      quantity: number;
      topping_ids: string[];
      notes?: string;
    }[];
    coupon_code?: string;
  }): Order {
    const orderId = `ord-${Date.now()}`;
    const orderNum = `POS-${Math.floor(100000 + Math.random() * 900000)}`;

    let subtotal = 0;
    const generatedItems: OrderItem[] = [];

    params.items.forEach(item => {
      const p = this.products.find(prod => prod.id === item.product_id);
      if (!p) return;

      // Base price by size
      let basePrice = p.small_price;
      if (item.size === 'Medium') basePrice = p.medium_price;
      if (item.size === 'Large') basePrice = p.large_price;

      // Apply product discount
      if (p.discount_percent > 0) {
        basePrice = basePrice * (1 - p.discount_percent / 100);
      }

      // Topping price aggregate
      let toppingsCost = 0;
      const associatedToppings: Topping[] = [];
      item.topping_ids.forEach(tid => {
        const top = this.toppings.find(t => t.id === tid);
        if (top) {
          toppingsCost += top.price;
          associatedToppings.push(top);
        }
      });

      const singleItemPrice = basePrice + toppingsCost;
      const lineCost = singleItemPrice * item.quantity;
      subtotal += lineCost;

      const orderItemId = `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      generatedItems.push({
        id: orderItemId,
        order_id: orderId,
        product_id: item.product_id,
        size: item.size,
        quantity: item.quantity,
        price: singleItemPrice,
        notes: item.notes,
        toppings: associatedToppings
      });
    });

    // Coupon Calculation
    let discountAmount = 0;
    if (params.coupon_code) {
      const resVal = this.edgeFunctionApplyCoupon({ code: params.coupon_code, amount: subtotal });
      if (resVal.valid) {
        discountAmount = resVal.discount_amount;
      }
    }

    // Taxes based on systemSettings
    const taxRate = (this.systemSettings.taxPercent ?? 10) / 100;
    const taxedAmount = Math.max(0, subtotal - discountAmount);
    const taxValue = Number((taxedAmount * taxRate).toFixed(2));
    const grandTotal = Number((taxedAmount + taxValue).toFixed(2));

    const newOrder: Order = {
      id: orderId,
      order_number: orderNum,
      table_id: params.table_id,
      customer_id: params.customer_id,
      status: 'Pending',
      subtotal: Number(subtotal.toFixed(2)),
      discount: Number(discountAmount.toFixed(2)),
      tax: taxValue,
      total: grandTotal,
      payment_method: null,
      created_by: this.currentUserId,
      created_at: new Date().toISOString()
    };

    // Loyalty point allocation if customer ID exists
    if (params.customer_id) {
      const cIdx = this.customers.findIndex(c => c.id === params.customer_id);
      if (cIdx >= 0) {
        this.customers[cIdx].visits += 1;
        const multiplier = this.systemSettings.pointsPerSpent ?? 1;
        this.customers[cIdx].points += Math.floor(grandTotal * multiplier);
        this.save('CUSTOMERS', this.customers);
      }
    }

    // Lock the table
    if (params.table_id) {
      this.updateTableStatus(params.table_id, 'Occupied');
    }

    // Save orders and items
    this.orders.push(newOrder);
    this.orderItems.push(...generatedItems);

    this.save('ORDERS', this.orders);
    this.save('ORDER_ITEMS', this.orderItems);

    return newOrder;
  }

  /**
   * Edge Function: apply-coupon
   * Validates a coupon and returns discount values
   */
  edgeFunctionApplyCoupon(params: { code: string; amount: number }): {
    valid: boolean;
    discount_percent?: number;
    discount_amount: number;
    message: string;
  } {
    const coupon = this.coupons.find(c => c.code.toUpperCase() === params.code.trim().toUpperCase() && c.active);
    if (!coupon) {
      return { valid: false, discount_amount: 0, message: 'Invalid or deactivated coupon.' };
    }

    // Check expiration
    if (new Date(coupon.expire_date).getTime() < Date.now()) {
      return { valid: false, discount_amount: 0, message: 'This coupon has expired.' };
    }

    let discountAmt = 0;
    if (coupon.type === 'percent') {
      discountAmt = params.amount * (coupon.value / 100);
      return {
        valid: true,
        discount_percent: coupon.value,
        discount_amount: Number(discountAmt.toFixed(2)),
        message: `Success! ${coupon.value}% discount applied.`
      };
    } else {
      discountAmt = Math.min(params.amount, coupon.value);
      return {
        valid: true,
        discount_percent: Math.round((discountAmt / params.amount) * 100),
        discount_amount: Number(discountAmt.toFixed(2)),
        message: `Success! ${this.systemSettings.currency || '€'}${coupon.value} discount applied.`
      };
    }
  }

  /**
   * Edge Function: payment-success
   * Validates invoice payment completion, assigns payment method, and flags order status.
   */
  edgeFunctionPaymentSuccess(orderId: string, paymentMethod: PaymentMethod): Order | null {
    const idx = this.orders.findIndex(o => o.id === orderId);
    if (idx >= 0) {
      this.orders[idx].status = 'Preparing'; // shifts from Pending to Preparing on successful pay
      this.orders[idx].payment_method = paymentMethod;
      this.save('ORDERS', this.orders);
      return this.orders[idx];
    }
    return null;
  }

  /**
   * Edge Function: generate-receipt
   * Conceptual or triggers a downloadable image/text payload, returns receipt content for print view
   */
  edgeFunctionGenerateReceipt(orderId: string) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return null;

    const items = this.getOrderItems(orderId).map(item => {
      const p = this.products.find(prod => prod.id === item.product_id);
      return {
        ...item,
        productName: p ? p.name : 'Unknown Product'
      };
    });

    const table = this.tables.find(t => t.id === order.table_id);
    const customer = this.customers.find(c => c.id === order.customer_id);

    return {
      restaurant: 'Slice & Savor Bistro',
      address: '71 Gourmet Avenue, Food District',
      phone: '+855 (12) 345-678',
      orderNumber: order.order_number,
      tableNumber: table ? table.table_number : 'Takeaway',
      customerName: customer ? customer.name : 'Walk-in Customer',
      customerPoints: customer ? customer.points : 0,
      createdAt: order.created_at,
      items,
      subtotal: order.subtotal,
      discount: order.discount,
      tax: order.tax,
      total: order.total,
      paymentMethod: order.payment_method || 'Unpaid',
      qrValue: `https://slice-and-savor.com/verify-invoice/${order.order_number}`,
      thankYouMessage: 'Thank you for dining with us! Savor the slice!'
    };
  }

  /**
   * Edge Function: dashboard-statistics
   * Returns calculated insights
   */
  edgeFunctionDashboardStatistics() {
    const today = new Date();
    today.setHours(0,0,0,0);
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000);
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 3600 * 1000);

    let todaySales = 0;
    let weeklySales = 0;
    let monthlySales = 0;
    let completedOrders = 0;

    this.orders.forEach(o => {
      // only count Completed or active Preparing/Ready orders towards sales records
      if (o.status !== 'Cancelled') {
        const oDate = new Date(o.created_at);
        if (oDate >= today) todaySales += o.total;
        if (oDate >= oneWeekAgo) weeklySales += o.total;
        if (oDate >= oneMonthAgo) monthlySales += o.total;
        
        if (o.status === 'Completed') {
          completedOrders += 1;
        }
      }
    });

    return {
      today_sales: Number(todaySales.toFixed(2)),
      weekly_sales: Number(weeklySales.toFixed(2)),
      monthly_sales: Number(monthlySales.toFixed(2)),
      orders_count: this.orders.length,
      completed_orders: completedOrders,
      average_order_value: this.orders.length > 0 ? Number((monthlySales / this.orders.length).toFixed(2)) : 0,
      customer_count: this.customers.length
    };
  }
}

// Single instance shared across files
export const db = new SupabaseLocalDatabase();
