import { create } from 'zustand';
import { db } from '../supabase/supabaseMock';
import { 
  Category, Product, Topping, Table, Order, OrderItem, Coupon, Customer, User, UserRole, NotificationMsg, OrderStatus, PaymentMethod 
} from '../types';

export interface CartItem {
  id: string;
  product: Product;
  size: 'Small' | 'Medium' | 'Large';
  quantity: number;
  toppings: Topping[];
  notes?: string;
  unitPrice: number; // calculated base + toppings
}

interface POSState {
  // DB States
  categories: Category[];
  products: Product[];
  toppings: Topping[];
  tables: Table[];
  orders: Order[];
  customers: Customer[];
  coupons: Coupon[];
  users: User[];
  
  // Active UI States
  currentTab: string; // pos, dashboard, orders, tables, products, categories, customers, kitchen, users, settings
  searchQuery: string;
  selectedCategoryId: string; // 'all' or specific id
  darkMode: boolean;
  language: 'en' | 'kh';
  currentUserRole: UserRole;
  currentUserId: string;
  notifications: NotificationMsg[];
  
  // Cart/Checkout States
  cart: CartItem[];
  activeTableId: string | null;
  activeCustomerId: string | null;
  currentCouponCode: string | null;
  discountPercent: number;
  discountAmount: number;
  
  // Methods - Data Sync
  refreshFromDB: () => void;
  
  // Methods - Visual Config
  setCurrentTab: (tab: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategoryId: (id: string) => void;
  toggleDarkMode: () => void;
  setLanguage: (lang: 'en' | 'kh') => void;
  setCurrentUserRole: (role: UserRole) => void;
  
  // Methods - Notifications
  addNotification: (title: string, message: string, type?: 'info' | 'success' | 'warning') => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // Methods - Cart operations
  addToCart: (product: Product, size: 'Small' | 'Medium' | 'Large', quantity: number, toppings: Topping[], notes?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQty: (cartItemId: string, change: number) => void;
  setTable: (tableId: string | null) => void;
  setCustomer: (customerId: string | null) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  clearCart: () => void;
  
  // Methods - Checkout execution
  createOrderAndPay: (paymentMethod: PaymentMethod) => { success: boolean; order: Order | null; error?: string };
  updateOrderStatusAndNotify: (orderId: string, status: OrderStatus) => void;
}

export const usePOSStore = create<POSState>((set, get) => {
  // Setup standard initial listener to sync multiple tabs if applicable
  db.subscribe(() => {
    // Only refresh variables that can be modified concurrently
    set({
      categories: db.getCategories(),
      products: db.getProducts(),
      toppings: db.getToppings(),
      tables: db.getTables(),
      orders: db.getOrders(),
      customers: db.getCustomers(),
      coupons: db.getCoupons(),
      users: db.getUsers()
    });
  });

  return {
    // Initial Hydrations
    categories: db.getCategories(),
    products: db.getProducts(),
    toppings: db.getToppings(),
    tables: db.getTables(),
    orders: db.getOrders(),
    customers: db.getCustomers(),
    coupons: db.getCoupons(),
    users: db.getUsers(),
    
    currentTab: 'pos',
    searchQuery: '',
    selectedCategoryId: 'all',
    darkMode: db.darkMode,
    language: db.language as 'en' | 'kh',
    currentUserRole: 'Admin', // Default Role of standard active tablet
    currentUserId: db.currentUserId,
    notifications: [],
    
    cart: [],
    activeTableId: null,
    activeCustomerId: null,
    currentCouponCode: null,
    discountPercent: 0,
    discountAmount: 0,
    
    // Sync Action
    refreshFromDB: () => {
      set({
        categories: db.getCategories(),
        products: db.getProducts(),
        toppings: db.getToppings(),
        tables: db.getTables(),
        orders: db.getOrders(),
        customers: db.getCustomers(),
        coupons: db.getCoupons(),
        users: db.getUsers(),
        darkMode: db.darkMode,
        language: db.language as 'en' | 'kh',
        currentUserId: db.currentUserId
      });
    },
    
    // Navigation & Filters
    setCurrentTab: (tab) => set({ currentTab: tab }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
    
    toggleDarkMode: () => {
      const target = !get().darkMode;
      db.setDarkMode(target);
      set({ darkMode: target });
      
      // Apply class on index.html element
      if (target) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    
    setLanguage: (lang) => {
      db.setLanguage(lang);
      set({ language: lang });
    },
    
    setCurrentUserRole: (role) => {
      set({ currentUserRole: role });
      // Map basic names
      const matchedUser = db.getUsers().find(u => u.role === role);
      if (matchedUser) {
        db.setCurrentUser(matchedUser.id);
        set({ currentUserId: matchedUser.id });
      }
    },
    
    // Notification engine
    addNotification: (title, message, type = 'info') => {
      const newNotif: NotificationMsg = {
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        title,
        message,
        type,
        timestamp: new Date()
      };
      set((state) => ({ notifications: [newNotif, ...state.notifications].slice(0, 20) }));
    },
    
    removeNotification: (id) => {
      set((state) => ({ notifications: state.notifications.filter(n => n.id !== id) }));
    },
    
    clearNotifications: () => set({ notifications: [] }),
    
    // Cart Mechanics
    addToCart: (product, size, quantity, toppings, notes) => {
      const { cart } = get();
      
      // Determine base price by size
      let baseVal = product.small_price;
      if (size === 'Medium') baseVal = product.medium_price;
      if (size === 'Large') baseVal = product.large_price;
      
      // Apply active product discount
      if (product.discount_percent > 0) {
        baseVal = baseVal * (1 - product.discount_percent / 100);
      }
      
      const toppingsCost = toppings.reduce((acc, t) => acc + t.price, 0);
      const calculatedUnitCost = baseVal + toppingsCost;
      
      // Helper: Match items with same product, size, and toppings
      const existingMatchIdx = cart.findIndex(item => {
        const pMatch = item.product.id === product.id;
        const sMatch = item.size === size;
        const toppingsSortedIds = item.toppings.map(t => t.id).sort().join(',');
        const inputToppingsSortedIds = toppings.map(t => t.id).sort().join(',');
        const tMatch = toppingsSortedIds === inputToppingsSortedIds;
        const notesMatch = item.notes === notes;
        return pMatch && sMatch && tMatch && notesMatch;
      });
      
      if (existingMatchIdx >= 0) {
        // increase quantity
        const updated = [...cart];
        updated[existingMatchIdx].quantity += quantity;
        set({ cart: updated });
        get().addNotification(
          'Updated Cart Unit', 
          `Increased quantity of ${product.name} (${size}) in cart.`, 
          'success'
        );
      } else {
        // add new item
        const newItem: CartItem = {
          id: `cart-it-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          product,
          size,
          quantity,
          toppings,
          notes,
          unitPrice: Number(calculatedUnitCost.toFixed(2))
        };
        set({ cart: [...cart, newItem] });
        get().addNotification(
          'Added to Cart', 
          `Mouthwatering ${product.name} (${size}) is ready in order list.`, 
          'success'
        );
      }
      
      // Trigger live recalculate of coupons if applied
      const { currentCouponCode } = get();
      if (currentCouponCode) {
        get().applyCoupon(currentCouponCode);
      }
    },
    
    removeFromCart: (cartItemId) => {
      const filtered = get().cart.filter(item => item.id !== cartItemId);
      set({ cart: filtered });
      
      const { currentCouponCode } = get();
      if (currentCouponCode) {
        get().applyCoupon(currentCouponCode);
      }
    },
    
    updateCartQty: (cartItemId, change) => {
      const updated = get().cart.map(item => {
        if (item.id === cartItemId) {
          const targetQty = Math.max(1, item.quantity + change);
          return { ...item, quantity: targetQty };
        }
        return item;
      });
      set({ cart: updated });
      
      const { currentCouponCode } = get();
      if (currentCouponCode) {
        get().applyCoupon(currentCouponCode);
      }
    },
    
    setTable: (tableId) => set({ activeTableId: tableId }),
    setCustomer: (customerId) => set({ activeCustomerId: customerId }),
    
    applyCoupon: (code) => {
      const subtotal = get().cart.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
      const res = db.edgeFunctionApplyCoupon({ code, amount: subtotal });
      
      if (res.valid) {
        set({
          currentCouponCode: code,
          discountPercent: res.discount_percent || 0,
          discountAmount: res.discount_amount
        });
        get().addNotification('Coupon Applied', res.message, 'success');
        return { success: true, message: res.message };
      } else {
        // clear coupon state on invalid attempt
        set({
          currentCouponCode: null,
          discountPercent: 0,
          discountAmount: 0
        });
        return { success: false, message: res.message };
      }
    },
    
    removeCoupon: () => {
      set({
        currentCouponCode: null,
        discountPercent: 0,
        discountAmount: 0
      });
      get().addNotification('Coupon Removed', 'Coupon deactivated from current order.', 'info');
    },
    
    clearCart: () => {
      set({
        cart: [],
        activeTableId: null,
        activeCustomerId: null,
        currentCouponCode: null,
        discountPercent: 0,
        discountAmount: 0
      });
    },
    
    // Core checkout executor orchestrating DB insertions and transaction logging
    createOrderAndPay: (payMethod) => {
      const { cart, activeTableId, activeCustomerId, currentCouponCode } = get();
      if (cart.length === 0) {
        return { success: false, order: null, error: 'Empty Shopping Cart' };
      }
      
      try {
        const edgeParams = {
          table_id: activeTableId,
          customer_id: activeCustomerId,
          coupon_code: currentCouponCode || undefined,
          items: cart.map(item => ({
            product_id: item.product.id,
            size: item.size,
            quantity: item.quantity,
            topping_ids: item.toppings.map(t => t.id),
            notes: item.notes
          }))
        };
        
        // 1. Core edge creation
        const pendingOrder = db.edgeFunctionCreateOrder(edgeParams);
        
        // 2. Perform payment completion triggering state transition
        const finalOrder = db.edgeFunctionPaymentSuccess(pendingOrder.id, payMethod);
        
        if (finalOrder) {
          get().refreshFromDB();
          get().clearCart();
          get().addNotification(
            'Order Finalized', 
            `Order #${finalOrder.order_number} successfully placed with ${payMethod}.`, 
            'success'
          );
          return { success: true, order: finalOrder };
        } else {
          return { success: false, order: null, error: 'Checkout failed during payment stage.' };
        }
      } catch (err: any) {
        return { success: false, order: null, error: err.message || 'Unknown checkout error' };
      }
    },
    
    updateOrderStatusAndNotify: (orderId, status) => {
      db.updateOrderStatus(orderId, status);
      const o = db.getOrders().find(order => order.id === orderId);
      
      let badgeType: 'info' | 'success' | 'warning' = 'info';
      if (status === 'Completed') badgeType = 'success';
      if (status === 'Ready') badgeType = 'success';
      if (status === 'Cancelled') badgeType = 'warning';
      
      get().addNotification(
        `Order Status: ${status}`, 
        `Order #${o ? o.order_number : 'POS'} updated successfully to ${status}.`, 
        badgeType
      );
      
      get().refreshFromDB();
    }
  };
});
