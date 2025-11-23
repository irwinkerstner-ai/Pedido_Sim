import React, { useState, useMemo } from 'react';
import { PRODUCTS, INITIAL_USERS, INITIAL_ROUTES, INITIAL_ORDERS } from './constants';
import { CartItem, Product, User, AppView, ShippingRoute, Order, OrderStatus } from './types';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { ResetPassword } from './components/ResetPassword';
import { ProductManager } from './components/ProductManager';
import { UserManager } from './components/UserManager';
import { ShippingManager } from './components/ShippingManager';
import { OrderCockpit } from './components/OrderCockpit';
import { ProductCard } from './components/ProductCard';
import { formatCurrency, generateCSV } from './utils/formatters';
import { generateOrderEmail } from './services/geminiService';
import { ShoppingCart, ArrowLeft, Check, Download, Mail, Package, Truck, FileText, LogOut, Settings, Users, Percent, TrendingUp } from 'lucide-react';

function App() {
  const [view, setView] = useState<AppView>(AppView.LOGIN);
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [shippingRoutes, setShippingRoutes] = useState<ShippingRoute[]>(INITIAL_ROUTES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [generatedEmail, setGeneratedEmail] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Logic ---

  const handleLogin = (userData: User) => {
    setUser(userData);
    setView(AppView.PRODUCT_LIST);
  };

  const handleRegister = (newUser: User) => {
    // Add new user to state and log them in
    const userWithId = { ...newUser, id: Date.now().toString() };
    setUsers(prev => [...prev, userWithId]);
    setUser(userWithId);
    setView(AppView.PRODUCT_LIST);
  };

  const handleAddUser = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    // If the currently logged in user is being updated, update the session state as well
    if (user && user.id === updatedUser.id) {
        setUser(updatedUser);
    }
  };

  const handleDeleteUser = (id: string) => {
    // Prevent deleting yourself
    if (user && user.id === id) {
        alert("Você não pode excluir seu próprio usuário enquanto está logado.");
        return;
    }
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const handleResetPassword = (email: string) => {
    console.log(`Reset link sent to ${email}`);
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    setView(AppView.LOGIN);
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleAddRoute = (newRoute: ShippingRoute) => {
    setShippingRoutes(prev => [...prev, newRoute]);
  };

  const handleUpdateRoute = (updatedRoute: ShippingRoute) => {
    setShippingRoutes(prev => prev.map(r => r.id === updatedRoute.id ? updatedRoute : r));
  };

  const handleDeleteRoute = (id: string) => {
    setShippingRoutes(prev => prev.filter(r => r.id !== id));
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleQuantityChange = (productId: string, delta: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId);
      const product = products.find(p => p.id === productId);

      if (!product) return prevCart;

      if (existingItem) {
        const newQuantity = existingItem.quantity + delta;
        if (newQuantity <= 0) {
          return prevCart.filter(item => item.id !== productId);
        }
        return prevCart.map(item => 
          item.id === productId ? { ...item, quantity: newQuantity } : item
        );
      } else if (delta > 0) {
        return [...prevCart, { ...product, quantity: 1 }];
      }
      return prevCart;
    });
  };

  const getItemQuantity = (productId: string) => {
    return cart.find(item => item.id === productId)?.quantity || 0;
  };

  // Shipping Calculation based on User Region Percentage
  const totals = useMemo(() => {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    // Find the user's route to get the percentage
    let shippingPercentage = 0;
    let routeName = 'Não Definida';
    if (user && user.regionId) {
      const userRoute = shippingRoutes.find(r => r.id === user.regionId);
      if (userRoute) {
        shippingPercentage = userRoute.percentage;
        routeName = userRoute.name;
      }
    }

    // Calculate shipping based on percentage of subtotal
    const shipping = subtotal * (shippingPercentage / 100);

    return {
      subtotal,
      shipping,
      shippingPercentage,
      routeName,
      total: subtotal + shipping,
      itemsCount: cart.reduce((acc, item) => acc + item.quantity, 0)
    };
  }, [cart, user, shippingRoutes]);

  const confirmOrder = async () => {
    if (!user) return;
    setIsProcessing(true);
    
    try {
        // Generate AI Email
        const emailBody = await generateOrderEmail(cart, user.username, totals.total, totals.shipping);
        setGeneratedEmail(emailBody);

        // Save Order to State
        const newOrder: Order = {
            id: Date.now().toString(),
            userId: user.id || 'unknown',
            userName: user.username,
            userEmail: user.email,
            date: new Date().toISOString(),
            items: [...cart], // Clone cart
            subtotal: totals.subtotal,
            shipping: totals.shipping,
            total: totals.total,
            status: 'PENDING',
            shippingRouteName: totals.routeName
        };

        setOrders(prev => [newOrder, ...prev]);

        // Change View
        setView(AppView.CONFIRMATION);
    } catch (err) {
        console.error(err);
    } finally {
        setIsProcessing(false);
    }
  };

  // --- Views ---

  if (view === AppView.LOGIN) {
    return (
        <Login 
            onLogin={handleLogin} 
            onRegisterClick={() => setView(AppView.REGISTER)}
            onForgotPasswordClick={() => setView(AppView.RESET_PASSWORD)}
            users={users}
        />
    );
  }

  if (view === AppView.REGISTER) {
      return (
          <Register 
            onRegister={handleRegister} 
            onBack={() => setView(AppView.LOGIN)}
            shippingRoutes={shippingRoutes}
          />
      );
  }

  if (view === AppView.RESET_PASSWORD) {
      return (
          <ResetPassword 
            onReset={handleResetPassword}
            onBack={() => setView(AppView.LOGIN)}
          />
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => view !== AppView.CONFIRMATION && setView(AppView.PRODUCT_LIST)}>
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Package className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-slate-800 hidden sm:block">EasyOrder</span>
            </div>
            
            <div className="flex items-center gap-4">
                {/* Admin Controls */}
                {view !== AppView.CONFIRMATION && user?.role === 'admin' && (
                  <div className="flex items-center gap-2 mr-2 border-r border-slate-200 pr-4">
                     <button 
                        onClick={() => setView(AppView.COCKPIT)}
                        className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${view === AppView.COCKPIT ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
                        title="Cockpit de Pedidos"
                    >
                        <TrendingUp size={20} />
                        <span className="text-xs font-bold hidden md:inline">Cockpit</span>
                    </button>
                    <button 
                        onClick={() => setView(AppView.PRODUCT_MANAGEMENT)}
                        className={`p-2 rounded-lg transition-colors ${view === AppView.PRODUCT_MANAGEMENT ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
                        title="Gerenciar Produtos"
                    >
                        <Settings size={20} />
                    </button>
                    <button 
                        onClick={() => setView(AppView.SHIPPING_MANAGEMENT)}
                        className={`p-2 rounded-lg transition-colors ${view === AppView.SHIPPING_MANAGEMENT ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
                        title="Tabela de Frete"
                    >
                        <Truck size={20} />
                    </button>
                     <button 
                        onClick={() => setView(AppView.USER_MANAGEMENT)}
                        className={`p-2 rounded-lg transition-colors ${view === AppView.USER_MANAGEMENT ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
                        title="Gerenciar Usuários"
                    >
                        <Users size={20} />
                    </button>
                  </div>
                )}
                
                <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium text-slate-900">{user?.username}</div>
                    <div className="text-xs text-slate-500 flex items-center justify-end gap-1">
                      {user?.role === 'admin' && <span className="bg-purple-100 text-purple-700 px-1.5 rounded text-[10px] font-bold">ADMIN</span>}
                      {user?.city ? `${user.city}` : 'Logado'}
                    </div>
                </div>
                <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors" title="Sair">
                    <LogOut size={20} />
                </button>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {/* View: Cockpit */}
        {view === AppView.COCKPIT && (
            <OrderCockpit 
                orders={orders}
                users={users} // Pass complete user list for detailed CSV export
                onUpdateStatus={handleUpdateOrderStatus}
                onBack={() => setView(AppView.PRODUCT_LIST)}
            />
        )}

        {/* View: User Manager */}
        {view === AppView.USER_MANAGEMENT && (
            <UserManager 
                users={users}
                shippingRoutes={shippingRoutes}
                onAddUser={handleAddUser}
                onEditUser={handleUpdateUser}
                onDeleteUser={handleDeleteUser}
                onBack={() => setView(AppView.PRODUCT_LIST)}
            />
        )}

        {/* View: Shipping Manager */}
        {view === AppView.SHIPPING_MANAGEMENT && (
            <ShippingManager 
                routes={shippingRoutes}
                onAddRoute={handleAddRoute}
                onEditRoute={handleUpdateRoute}
                onDeleteRoute={handleDeleteRoute}
                onBack={() => setView(AppView.PRODUCT_LIST)}
            />
        )}

        {/* View: Product Manager */}
        {view === AppView.PRODUCT_MANAGEMENT && (
            <ProductManager 
                products={products} 
                onAddProduct={handleAddProduct}
                onDeleteProduct={handleDeleteProduct}
                onBack={() => setView(AppView.PRODUCT_LIST)}
            />
        )}
        
        {/* View: Product List */}
        {view === AppView.PRODUCT_LIST && (
            <>
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">Catálogo de Produtos</h1>
                    <p className="text-slate-500">Selecione os itens e quantidades desejadas.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map(product => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            quantity={getItemQuantity(product.id)}
                            onUpdateQuantity={handleQuantityChange}
                        />
                    ))}
                    {products.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
                            Nenhum produto disponível no momento.
                        </div>
                    )}
                </div>
            </>
        )}

        {/* View: Order Summary */}
        {view === AppView.SUMMARY && (
            <div className="max-w-4xl mx-auto">
                <button 
                    onClick={() => setView(AppView.PRODUCT_LIST)}
                    className="flex items-center text-slate-500 hover:text-blue-600 mb-6 transition-colors"
                >
                    <ArrowLeft size={16} className="mr-1" /> Voltar para Loja
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h2 className="text-2xl font-bold text-slate-800">Resumo do Pedido</h2>
                    </div>
                    
                    <div className="divide-y divide-slate-100">
                        {cart.map(item => (
                            <div key={item.id} className="p-6 flex items-center gap-4">
                                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-slate-100" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-slate-800">{item.name}</h3>
                                    <p className="text-sm text-slate-500">Qtd: {item.quantity} x {formatCurrency(item.price)}</p>
                                </div>
                                <div className="font-bold text-slate-800">
                                    {formatCurrency(item.price * item.quantity)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-slate-50 p-6 space-y-3">
                        <div className="flex justify-between text-slate-600">
                            <span>Subtotal</span>
                            <span>{formatCurrency(totals.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600 items-center">
                            <span className="flex items-center gap-2">
                                <Truck size={16} /> Frete ({totals.shippingPercentage}%)
                            </span>
                            <span>{formatCurrency(totals.shipping)}</span>
                        </div>
                         <div className="flex justify-end text-xs text-slate-400">
                             Região: {totals.routeName}
                         </div>
                        <div className="pt-3 border-t border-slate-200 flex justify-between text-xl font-bold text-slate-900">
                            <span>Total</span>
                            <span>{formatCurrency(totals.total)}</span>
                        </div>
                    </div>
                    
                    <div className="p-6 bg-white">
                        <button 
                            onClick={confirmOrder}
                            disabled={isProcessing}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-green-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                        >
                            {isProcessing ? (
                                <span className="animate-pulse">Processando Inteligência Artificial...</span>
                            ) : (
                                <>
                                    <Check size={20} /> Confirmar Pedido
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* View: Confirmation */}
        {view === AppView.CONFIRMATION && (
            <div className="max-w-3xl mx-auto animate-fade-in">
                <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
                    <div className="bg-green-600 p-8 text-center text-white">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold">Pedido Confirmado!</h2>
                        <p className="text-green-100 mt-2">Uma cópia foi enviada para {user?.email}</p>
                    </div>

                    <div className="p-8">
                        <div className="grid gap-6 md:grid-cols-2 mb-8">
                            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                    <FileText size={18} className="text-blue-500" /> Planilha de Pedido
                                </h4>
                                <p className="text-sm text-slate-500 mb-4">
                                    Baixe a planilha detalhada (.csv) contendo todos os itens solicitados para importação no ERP.
                                </p>
                                <a 
                                    href={generateCSV(cart)} 
                                    download={`pedido_${new Date().getTime()}.csv`}
                                    className="block w-full text-center py-2 px-4 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 hover:border-blue-400 hover:text-blue-600 transition-all font-medium text-sm"
                                >
                                    <Download size={16} className="inline mr-2" /> Baixar Planilha
                                </a>
                            </div>

                            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                    <Mail size={18} className="text-blue-500" /> Envio de Cópia
                                </h4>
                                <p className="text-sm text-slate-500">
                                    A cópia foi enviada para o solicitante e para o setor de recebimento (almoxarifado@empresa.com.br).
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                                E-mail Gerado Automaticamente (IA)
                            </h3>
                            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 font-mono text-sm text-slate-700 whitespace-pre-wrap">
                                {generatedEmail}
                            </div>
                        </div>

                        <button 
                            onClick={() => {
                                setCart([]);
                                setView(AppView.PRODUCT_LIST);
                            }}
                            className="mt-8 w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                        >
                            Realizar Novo Pedido
                        </button>
                    </div>
                </div>
            </div>
        )}

      </main>

      {/* Sticky Footer Cart Summary (Only visible in Product List when items exist) */}
      {view === AppView.PRODUCT_LIST && cart.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] border-t border-slate-200 p-4 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6">
                    <div className="flex items-center gap-2 text-slate-600">
                        <ShoppingCart className="w-5 h-5" />
                        <span className="font-medium">{totals.itemsCount} itens</span>
                    </div>
                    <div className="text-xl font-bold text-slate-900">
                        Total: {formatCurrency(totals.total)}
                    </div>
                </div>
                <button 
                    onClick={() => setView(AppView.SUMMARY)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors"
                >
                    Revisar Pedido
                </button>
            </div>
        </div>
      )}
    </div>
  );
}

export default App;