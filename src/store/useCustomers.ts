import { create } from 'zustand';
import { Customer, CustomerPurchase, CustomerSummary, CustomerVisit } from '../types/customer';
import { Quote } from '../types/quote';

interface CustomerStore {
  customers: Customer[];
  visits: CustomerVisit[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'totalVisits' | 'customerSince' | 'loyaltyPoints'>) => void;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  getCustomerById: (id: string) => Customer | undefined;
  getCustomerPurchases: (customerId: string) => CustomerPurchase[];
  getCustomerVisits: (customerId: string) => CustomerVisit[];
  getCustomerSummary: (customerId: string) => CustomerSummary;
  searchCustomers: (query: string) => Customer[];
  addVisit: (visit: Omit<CustomerVisit, 'id'>) => void;
  getLoyaltyLevel: (totalSpent: number, totalVisits: number) => "Nuevo" | "Regular" | "Frecuente" | "VIP";
}

// Base de datos expandida de clientes
const mockCustomers: Customer[] = [
  {
    id: '1',
    firstName: 'Juan',
    lastName: 'Pérez',
    phone: '5551-2345',
    nit: '12345678-9',
    email: 'juan.perez@email.com',
    address: 'Zona 1, Ciudad de Guatemala',
    createdAt: '2024-01-15',
    updatedAt: '2024-10-20',
    totalVisits: 15,
    lastVisit: '2024-10-20',
    customerSince: '2024-01-15',
    loyaltyPoints: 120,
    preferredPaymentMethod: 'tarjeta',
    notes: 'Cliente frecuente, prefiere herramientas de calidad premium'
  },
  {
    id: '2',
    firstName: 'María',
    lastName: 'González',
    phone: '5551-6789',
    nit: '87654321-0',
    email: 'maria.gonzalez@email.com',
    address: 'Zona 10, Ciudad de Guatemala',
    createdAt: '2024-02-01',
    updatedAt: '2024-10-18',
    totalVisits: 8,
    lastVisit: '2024-10-18',
    customerSince: '2024-02-01',
    loyaltyPoints: 65,
    preferredPaymentMethod: 'efectivo',
    notes: 'Constructora pequeña, compras regulares de materiales básicos'
  },
  {
    id: '3',
    firstName: 'Carlos',
    lastName: 'López',
    phone: '5551-9876',
    nit: '45678912-3',
    email: 'carlos.lopez@construcciones.com',
    address: 'Zona 7, Mixco',
    createdAt: '2024-02-10',
    updatedAt: '2024-10-22',
    totalVisits: 25,
    lastVisit: '2024-10-22',
    customerSince: '2024-02-10',
    loyaltyPoints: 250,
    preferredPaymentMethod: 'transferencia',
    notes: 'Empresa constructora grande, pedidos de volumen'
  },
  {
    id: '4',
    firstName: 'Ana',
    lastName: 'Martínez',
    phone: '5551-4567',
    nit: '78912345-6',
    email: 'ana.martinez@email.com',
    address: 'Zona 13, Ciudad de Guatemala',
    createdAt: '2024-03-05',
    updatedAt: '2024-10-15',
    totalVisits: 12,
    lastVisit: '2024-10-15',
    customerSince: '2024-03-05',
    loyaltyPoints: 95,
    preferredPaymentMethod: 'tarjeta',
    notes: 'Arquitecta independiente, proyectos residenciales'
  },
  {
    id: '5',
    firstName: 'Roberto',
    lastName: 'Silva',
    phone: '5551-7890',
    email: 'roberto.silva@email.com',
    address: 'Villa Nueva',
    createdAt: '2024-04-12',
    updatedAt: '2024-10-10',
    totalVisits: 6,
    lastVisit: '2024-10-10',
    customerSince: '2024-04-12',
    loyaltyPoints: 40,
    preferredPaymentMethod: 'efectivo',
    notes: 'Cliente ocasional, proyectos de hogar'
  },
  {
    id: '6',
    firstName: 'Lucia',
    lastName: 'Herrera',
    phone: '5551-3456',
    nit: '98765432-1',
    email: 'lucia.herrera@ferreterias.com',
    address: 'Zona 12, Ciudad de Guatemala',
    createdAt: '2024-05-20',
    updatedAt: '2024-10-23',
    totalVisits: 18,
    lastVisit: '2024-10-23',
    customerSince: '2024-05-20',
    loyaltyPoints: 180,
    preferredPaymentMethod: 'tarjeta',
    notes: 'Dueña de ferretería, compras de reposición'
  },
  {
    id: '7',
    firstName: 'Diego',
    lastName: 'Morales',
    phone: '5551-8901',
    email: 'diego.morales@email.com',
    address: 'San Juan Sacatepéquez',
    createdAt: '2024-06-08',
    updatedAt: '2024-10-12',
    totalVisits: 4,
    lastVisit: '2024-10-12',
    customerSince: '2024-06-08',
    loyaltyPoints: 25,
    preferredPaymentMethod: 'efectivo',
    notes: 'Cliente nuevo, aún explorando productos'
  },
  {
    id: '8',
    firstName: 'Carmen',
    lastName: 'Ruiz',
    phone: '5551-2109',
    nit: '56789123-4',
    email: 'carmen.ruiz@decoraciones.com',
    address: 'Zona 14, Ciudad de Guatemala',
    createdAt: '2024-07-03',
    updatedAt: '2024-10-21',
    totalVisits: 22,
    lastVisit: '2024-10-21',
    customerSince: '2024-07-03',
    loyaltyPoints: 210,
    preferredPaymentMethod: 'transferencia',
    notes: 'Empresa de decoración, necesidades específicas'
  }
];

// Historial de visitas detallado
const mockVisits: CustomerVisit[] = [
  // Juan Pérez
  { id: 'v1', customerId: '1', date: '2024-10-20', time: '14:30', type: 'purchase', description: 'Compra de herramientas eléctricas', amount: 850, products: ['Taladro', 'Sierra circular'] },
  { id: 'v2', customerId: '1', date: '2024-10-15', time: '10:15', type: 'quote', description: 'Cotización para proyecto de remodelación', amount: 1200, products: ['Cemento', 'Varillas', 'Blocks'] },
  { id: 'v3', customerId: '1', date: '2024-10-08', time: '16:45', type: 'visit', description: 'Consulta sobre materiales para terraza' },
  
  // María González
  { id: 'v4', customerId: '2', date: '2024-10-18', time: '09:20', type: 'purchase', description: 'Materiales para construcción básica', amount: 450, products: ['Tornillos', 'Clavos', 'Alambre'] },
  { id: 'v5', customerId: '2', date: '2024-10-12', time: '11:30', type: 'inquiry', description: 'Pregunta sobre precios de tubería PVC' },
  
  // Carlos López
  { id: 'v6', customerId: '3', date: '2024-10-22', time: '08:00', type: 'quote', description: 'Cotización grande para proyecto comercial', amount: 5500, products: ['Cemento', 'Hierro', 'Blocks', 'Arena'] },
  { id: 'v7', customerId: '3', date: '2024-10-20', time: '13:45', type: 'purchase', description: 'Pedido de herramientas especializadas', amount: 2100, products: ['Mezcladora', 'Vibrador de concreto'] },
  { id: 'v8', customerId: '3', date: '2024-10-18', time: '15:20', type: 'visit', description: 'Revisión de inventario disponible' },
  
  // Ana Martínez
  { id: 'v9', customerId: '4', date: '2024-10-15', time: '12:10', type: 'purchase', description: 'Materiales para proyecto residencial', amount: 680, products: ['Baldosas', 'Pegamento', 'Crucetas'] },
  { id: 'v10', customerId: '4', date: '2024-10-10', time: '16:30', type: 'quote', description: 'Cotización para baño completo', amount: 1400 },
  
  // Lucia Herrera
  { id: 'v11', customerId: '6', date: '2024-10-23', time: '07:30', type: 'purchase', description: 'Reposición de inventario ferretería', amount: 3200, products: ['Herramientas manuales', 'Tornillería', 'Candados'] },
  { id: 'v12', customerId: '6', date: '2024-10-21', time: '14:00', type: 'quote', description: 'Cotización para cliente mayorista', amount: 2800 },
];

// Mock quotes expandido para coincidir con clientes
const mockQuotes: Quote[] = [
  {
    id: 'Q001',
    customerName: 'Juan Pérez',
    validDays: 30,
    date: '2024-10-15',
    items: [
      { productId: '1', productName: 'Cemento Portland', quantity: 20, price: 45, discount: 5, total: 855 },
      { productId: '2', productName: 'Varillas #4', quantity: 15, price: 23, discount: 0, total: 345 },
    ],
    total: 1200,
    status: 'open',
  },
  {
    id: 'Q002',
    customerName: 'María González',
    validDays: 15,
    date: '2024-10-12',
    items: [
      { productId: '3', productName: 'Tornillos autoperforantes', quantity: 100, price: 0.50, discount: 10, total: 45 },
      { productId: '4', productName: 'Clavos 3"', quantity: 5, price: 12, discount: 0, total: 60 },
    ],
    total: 105,
    status: 'won',
  },
  {
    id: 'Q003',
    customerName: 'Carlos López',
    validDays: 45,
    date: '2024-10-22',
    items: [
      { productId: '5', productName: 'Mezcladora industrial', quantity: 1, price: 2500, discount: 15, total: 2125 },
      { productId: '6', productName: 'Cemento premium', quantity: 50, price: 52, discount: 8, total: 2392 },
      { productId: '7', productName: 'Arena lavada m³', quantity: 10, price: 98, discount: 5, total: 931 },
    ],
    total: 5448,
    status: 'open',
  },
  {
    id: 'Q004',
    customerName: 'Ana Martínez',
    validDays: 20,
    date: '2024-10-10',
    items: [
      { productId: '8', productName: 'Baldosas cerámicas', quantity: 25, price: 18, discount: 0, total: 450 },
      { productId: '9', productName: 'Pegamento para baldosas', quantity: 8, price: 35, discount: 5, total: 266 },
    ],
    total: 716,
    status: 'won',
  },
  {
    id: 'Q005',
    customerName: 'Lucia Herrera',
    validDays: 30,
    date: '2024-10-21',
    items: [
      { productId: '10', productName: 'Set herramientas manuales', quantity: 12, price: 85, discount: 12, total: 897.6 },
      { productId: '11', productName: 'Candados diversos', quantity: 24, price: 25, discount: 8, total: 552 },
    ],
    total: 1449.6,
    status: 'open',
  },
];

export const useCustomers = create<CustomerStore>((set, get) => ({
  customers: mockCustomers,
  visits: mockVisits,

  addCustomer: (customerData) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      totalVisits: 1,
      customerSince: new Date().toISOString().split('T')[0],
      loyaltyPoints: 0,
    };
    
    set((state) => ({
      customers: [...state.customers, newCustomer],
    }));
  },

  updateCustomer: (id, data) => {
    set((state) => ({
      customers: state.customers.map((customer) =>
        customer.id === id
          ? { ...customer, ...data, updatedAt: new Date().toISOString().split('T')[0] }
          : customer
      ),
    }));
  },

  deleteCustomer: (id) => {
    set((state) => ({
      customers: state.customers.filter((customer) => customer.id !== id),
      visits: state.visits.filter((visit) => visit.customerId !== id),
    }));
  },

  getCustomerById: (id) => {
    return get().customers.find((customer) => customer.id === id);
  },

  getCustomerVisits: (customerId) => {
    return get().visits.filter((visit) => visit.customerId === customerId)
      .sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime());
  },

  getCustomerPurchases: (customerId) => {
    const customer = get().getCustomerById(customerId);
    if (!customer) return [];

    const customerName = `${customer.firstName} ${customer.lastName}`;
    
    // Buscar cotizaciones del cliente
    const customerQuotes = mockQuotes.filter(
      (quote) => quote.customerName === customerName
    );

    return customerQuotes.map((quote): CustomerPurchase => ({
      id: quote.id,
      type: 'quote',
      date: quote.date,
      total: quote.total,
      items: quote.items.reduce((sum, item) => sum + item.quantity, 0),
      status: quote.status,
      reference: quote.id,
      paymentMethod: customer.preferredPaymentMethod || 'efectivo',
      discount: quote.items.reduce((sum, item) => sum + item.discount, 0) / quote.items.length,
      products: quote.items.map(item => ({
        name: item.productName,
        quantity: item.quantity,
        price: item.price,
      })),
    }));
  },

  getLoyaltyLevel: (totalSpent, totalVisits) => {
    if (totalSpent >= 5000 || totalVisits >= 20) return "VIP";
    if (totalSpent >= 2000 || totalVisits >= 10) return "Frecuente";
    if (totalSpent >= 500 || totalVisits >= 5) return "Regular";
    return "Nuevo";
  },

  getCustomerSummary: (customerId) => {
    const customer = get().getCustomerById(customerId);
    const purchases = get().getCustomerPurchases(customerId);
    const visits = get().getCustomerVisits(customerId);
    
    if (!customer) return {
      totalQuotes: 0,
      totalSales: 0,
      totalSpent: 0,
      activeQuotes: 0,
      averageOrderValue: 0,
      totalVisits: 0,
      loyaltyLevel: "Nuevo" as const,
      monthlyPurchases: 0,
      favoriteProducts: [],
    };
    
    const quotes = purchases.filter((p) => p.type === 'quote');
    const sales = purchases.filter((p) => p.type === 'sale');
    const activeQuotes = quotes.filter((q) => q.status === 'open').length;
    
    const completedPurchases = purchases.filter((p) => p.status === 'won' || p.status === 'completed');
    const totalSpent = completedPurchases.reduce((sum, p) => sum + p.total, 0);
    const averageOrderValue = completedPurchases.length > 0 ? totalSpent / completedPurchases.length : 0;

    // Calcular compras del último mes
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const monthlyPurchases = purchases.filter(p => new Date(p.date) >= lastMonth).length;

    // Productos favoritos (más comprados)
    const productCounts: Record<string, number> = {};
    purchases.forEach(purchase => {
      purchase.products.forEach(product => {
        productCounts[product.name] = (productCounts[product.name] || 0) + product.quantity;
      });
    });
    
    const favoriteProducts = Object.entries(productCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([product]) => product);

    const lastPurchase = purchases.length > 0 
      ? purchases.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date
      : undefined;

    const loyaltyLevel = get().getLoyaltyLevel(totalSpent, customer.totalVisits);

    return {
      totalQuotes: quotes.length,
      totalSales: sales.length,
      totalSpent,
      lastPurchase,
      activeQuotes,
      averageOrderValue,
      totalVisits: customer.totalVisits,
      loyaltyLevel,
      monthlyPurchases,
      favoriteProducts,
    };
  },

  searchCustomers: (query) => {
    const customers = get().customers;
    if (!query.trim()) return customers;

    const searchTerm = query.toLowerCase();
    return customers.filter(
      (customer) =>
        customer.firstName.toLowerCase().includes(searchTerm) ||
        customer.lastName.toLowerCase().includes(searchTerm) ||
        customer.phone.includes(searchTerm) ||
        customer.nit?.toLowerCase().includes(searchTerm) ||
        customer.email?.toLowerCase().includes(searchTerm)
    );
  },

  addVisit: (visitData) => {
    const newVisit: CustomerVisit = {
      ...visitData,
      id: Date.now().toString(),
    };
    
    set((state) => ({
      visits: [...state.visits, newVisit],
    }));

    // Incrementar contador de visitas del cliente
    const customer = get().getCustomerById(visitData.customerId);
    if (customer) {
      get().updateCustomer(visitData.customerId, {
        totalVisits: customer.totalVisits + 1,
        lastVisit: visitData.date,
      });
    }
  },
}));