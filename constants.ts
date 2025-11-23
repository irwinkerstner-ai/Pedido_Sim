import { Product, User, ShippingRoute, Order } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Notebook Dell Inspiron 15',
    category: 'Eletrônicos',
    price: 3500.00,
    image: 'https://picsum.photos/id/0/300/300',
    unit: 'un'
  },
  {
    id: '2',
    name: 'Mouse Sem Fio Logitech',
    category: 'Periféricos',
    price: 120.50,
    image: 'https://picsum.photos/id/3/300/300',
    unit: 'un'
  },
  {
    id: '3',
    name: 'Teclado Mecânico RGB',
    category: 'Periféricos',
    price: 450.00,
    image: 'https://picsum.photos/id/7/300/300',
    unit: 'un'
  },
  {
    id: '4',
    name: 'Monitor Ultrawide LG 29"',
    category: 'Eletrônicos',
    price: 1200.00,
    image: 'https://picsum.photos/id/4/300/300',
    unit: 'un'
  },
  {
    id: '5',
    name: 'Cadeira Ergonômica Office',
    category: 'Móveis',
    price: 850.00,
    image: 'https://picsum.photos/id/180/300/300',
    unit: 'un'
  },
  {
    id: '6',
    name: 'Headset Noise Cancelling',
    category: 'Áudio',
    price: 600.00,
    image: 'https://picsum.photos/id/250/300/300',
    unit: 'un'
  }
];

export const INITIAL_ROUTES: ShippingRoute[] = [
  { id: '1', name: 'Região Sul (Padrão)', percentage: 5.0 },
  { id: '2', name: 'Região Sudeste', percentage: 7.5 },
  { id: '3', name: 'Região Norte/Nordeste', percentage: 12.0 },
  { id: '4', name: 'Centro-Oeste', percentage: 9.0 }
];

export const INITIAL_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@easyorder.com',
    password: 'admin',
    role: 'admin',
    city: 'São Paulo',
    state: 'SP',
    regionId: '2'
  },
  {
    id: '2',
    username: 'Cliente Exemplo Ltda',
    email: 'compras@cliente.com',
    password: '123',
    role: 'user',
    cnpj: '12.345.678/0001-99',
    address: 'Av. Paulista, 1000',
    city: 'São Paulo',
    state: 'SP',
    regionId: '2'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: '1001',
    userId: '2',
    userName: 'Cliente Exemplo Ltda',
    userEmail: 'compras@cliente.com',
    date: new Date(Date.now() - 86400000).toISOString(), // Ontem
    items: [
      { ...PRODUCTS[0], quantity: 1 },
      { ...PRODUCTS[1], quantity: 2 }
    ],
    subtotal: 3741.00,
    shipping: 280.57, // Aprox 7.5%
    total: 4021.57,
    status: 'PENDING',
    shippingRouteName: 'Região Sudeste'
  },
  {
    id: '1002',
    userId: '2',
    userName: 'Cliente Exemplo Ltda',
    userEmail: 'compras@cliente.com',
    date: new Date(Date.now() - 172800000).toISOString(), // Anteontem
    items: [
      { ...PRODUCTS[4], quantity: 5 }
    ],
    subtotal: 4250.00,
    shipping: 318.75,
    total: 4568.75,
    status: 'DELIVERED',
    shippingRouteName: 'Região Sudeste'
  }
];