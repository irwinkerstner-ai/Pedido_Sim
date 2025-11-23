import React, { useState, useMemo } from 'react';
import { Order, OrderStatus, User } from '../types';
import { formatCurrency } from '../utils/formatters';
import { 
  ArrowLeft, 
  TrendingUp, 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck, 
  Search,
  Eye,
  Calendar,
  DollarSign,
  Package,
  Download
} from 'lucide-react';

interface OrderCockpitProps {
  orders: Order[];
  users: User[]; // Needed to fetch full user details for CSV
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onBack: () => void;
}

export const OrderCockpit: React.FC<OrderCockpitProps> = ({ orders, users, onUpdateStatus, onBack }) => {
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // --- Metrics Calculation ---
  const metrics = useMemo(() => {
    const totalRevenue = orders.reduce((acc, order) => order.status !== 'CANCELLED' ? acc + order.total : acc, 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
    const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return { totalRevenue, totalOrders, pendingOrders, avgTicket };
  }, [orders]);

  // --- Filtering ---
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'ALL' || order.status === filterStatus;
    const matchesSearch = 
      order.id.includes(searchTerm) || 
      order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // --- Helpers ---
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING': return 'Pendente';
      case 'PROCESSING': return 'Processando';
      case 'SHIPPED': return 'Enviado';
      case 'DELIVERED': return 'Entregue';
      case 'CANCELLED': return 'Cancelado';
    }
  };

  // --- CSV Export Logic ---
  const handleExportCSV = (ordersToExport: Order[], fileName: string) => {
    if (ordersToExport.length === 0) return;

    // Headers combining Order info + Customer info + Product info
    const headers = [
        'ID do Pedido',
        'Data',
        'Hora',
        'Status',
        'ID Cliente',
        'Nome Cliente',
        'Email Cliente',
        'CNPJ',
        'Endereço',
        'Cidade',
        'UF',
        'CEP',
        'ID Produto',
        'Nome Produto',
        'Categoria',
        'Unidade',
        'Quantidade',
        'Preço Unitário',
        'Total do Item', // Qtd * Preço
        'Subtotal Pedido',
        'Frete Pedido',
        'Rota de Frete',
        'Total Pedido'
    ];

    // Create rows: One row per ITEM in the order
    const rows = ordersToExport.flatMap(order => {
        // Find full user details
        const userDetails = users.find(u => u.id === order.userId) || {} as Partial<User>;
        const dateObj = new Date(order.date);

        // Map each item to a CSV row
        return order.items.map(item => {
            return [
                order.id,
                dateObj.toLocaleDateString(),
                dateObj.toLocaleTimeString(),
                getStatusLabel(order.status),
                order.userId,
                userDetails.username || order.userName, // Prefer current DB data, fallback to order snapshot
                userDetails.email || order.userEmail,
                userDetails.cnpj || '',
                userDetails.address || '',
                userDetails.city || '',
                userDetails.state || '',
                userDetails.cep || '',
                // Product Details
                item.id,
                item.name,
                item.category,
                item.unit,
                item.quantity,
                item.price.toFixed(2),
                (item.price * item.quantity).toFixed(2),
                // Order Totals (Repeated for each item)
                order.subtotal.toFixed(2),
                order.shipping.toFixed(2),
                order.shippingRouteName || '',
                order.total.toFixed(2),
            ].map(field => `"${String(field || '').replace(/"/g, '""')}"`).join(','); // Escape quotes and wrap
        });
    });

    // Add BOM for Excel compatibility with UTF-8
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp className="text-blue-600" /> Cockpit de Gestão
            </h1>
            <p className="text-slate-500">Visão geral de desempenho e administração de pedidos.</p>
        </div>
        <button 
            onClick={onBack}
            className="flex items-center text-slate-600 hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm w-fit"
        >
            <ArrowLeft size={18} className="mr-2" /> Voltar
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500">Receita Total</p>
                    <h3 className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(metrics.totalRevenue)}</h3>
                </div>
                <div className="p-2 bg-green-50 rounded-lg text-green-600">
                    <DollarSign size={24} />
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500">Total de Pedidos</p>
                    <h3 className="text-2xl font-bold text-slate-800 mt-1">{metrics.totalOrders}</h3>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <ShoppingBag size={24} />
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500">Pendentes</p>
                    <h3 className="text-2xl font-bold text-slate-800 mt-1">{metrics.pendingOrders}</h3>
                </div>
                <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
                    <Clock size={24} />
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500">Ticket Médio</p>
                    <h3 className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(metrics.avgTicket)}</h3>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                    <TrendingUp size={24} />
                </div>
            </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                <button 
                    onClick={() => setFilterStatus('ALL')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filterStatus === 'ALL' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                    Todos
                </button>
                <button 
                    onClick={() => setFilterStatus('PENDING')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filterStatus === 'PENDING' ? 'bg-yellow-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                    Pendentes
                </button>
                <button 
                    onClick={() => setFilterStatus('PROCESSING')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filterStatus === 'PROCESSING' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                    Processando
                </button>
                 <button 
                    onClick={() => setFilterStatus('DELIVERED')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filterStatus === 'DELIVERED' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                    Entregues
                </button>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Buscar pedido, cliente..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 p-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm"
                    />
                </div>
                <button
                    onClick={() => handleExportCSV(filteredOrders, `relatorio_pedidos_${Date.now()}.csv`)}
                    className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors whitespace-nowrap"
                    title="Exportar dados filtrados para Excel/CSV"
                >
                    <Download size={16} /> <span className="hidden sm:inline">Exportar Detalhado</span>
                </button>
            </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                        <th className="p-4">Pedido / Data</th>
                        <th className="p-4">Cliente</th>
                        <th className="p-4">Região</th>
                        <th className="p-4 text-right">Valor Total</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredOrders.map(order => (
                        <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4">
                                <div className="font-bold text-slate-800">#{order.id}</div>
                                <div className="text-xs text-slate-500 flex items-center gap-1">
                                    <Calendar size={10} />
                                    {new Date(order.date).toLocaleDateString()} {new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </div>
                            </td>
                            <td className="p-4">
                                <div className="font-medium text-slate-800">{order.userName}</div>
                                <div className="text-xs text-slate-500">{order.userEmail}</div>
                            </td>
                            <td className="p-4">
                                <div className="text-sm text-slate-600 flex items-center gap-1">
                                    <Truck size={12} className="text-slate-400" />
                                    {order.shippingRouteName || 'N/A'}
                                </div>
                            </td>
                            <td className="p-4 text-right font-bold text-slate-800">
                                {formatCurrency(order.total)}
                            </td>
                            <td className="p-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                    {getStatusLabel(order.status)}
                                </span>
                            </td>
                            <td className="p-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <button 
                                        onClick={() => handleExportCSV([order], `pedido_${order.id}.csv`)}
                                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                        title="Baixar CSV deste Pedido"
                                    >
                                        <Download size={18} />
                                    </button>
                                    <button 
                                        onClick={() => setSelectedOrder(order)}
                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Ver Detalhes"
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <select 
                                        value={order.status}
                                        onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                                        className="text-xs border border-slate-200 rounded p-1 focus:ring-2 focus:ring-blue-200 outline-none bg-white cursor-pointer"
                                        title="Alterar Status"
                                    >
                                        <option value="PENDING">Pendente</option>
                                        <option value="PROCESSING">Processando</option>
                                        <option value="SHIPPED">Enviado</option>
                                        <option value="DELIVERED">Entregue</option>
                                        <option value="CANCELLED">Cancelar</option>
                                    </select>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {filteredOrders.length === 0 && (
                        <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-500">
                                Nenhum pedido encontrado com os filtros atuais.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* Order Details Modal Overlay */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Pedido #{selectedOrder.id}</h2>
                        <p className="text-sm text-slate-500">Realizado em {new Date(selectedOrder.date).toLocaleString()}</p>
                    </div>
                    <button 
                        onClick={() => setSelectedOrder(null)}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
                    >
                        <XCircle size={24} />
                    </button>
                </div>
                
                <div className="p-6 space-y-6">
                    {/* Status & Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Cliente</h4>
                            <p className="font-semibold text-slate-800">{selectedOrder.userName}</p>
                            <p className="text-sm text-slate-600">{selectedOrder.userEmail}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Status Atual</h4>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedOrder.status)}`}>
                                {getStatusLabel(selectedOrder.status)}
                            </span>
                             <div className="mt-2 text-xs text-slate-500">
                                Rota: {selectedOrder.shippingRouteName || 'N/A'}
                            </div>
                        </div>
                    </div>

                    {/* Items List */}
                    <div>
                        <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <Package size={16} /> Itens do Pedido
                        </h4>
                        <div className="border border-slate-100 rounded-xl overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500">
                                    <tr>
                                        <th className="p-3 font-medium">Produto</th>
                                        <th className="p-3 font-medium text-center">Qtd</th>
                                        <th className="p-3 font-medium text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {selectedOrder.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="p-3 text-slate-700">{item.name}</td>
                                            <td className="p-3 text-center text-slate-600">{item.quantity} {item.unit}</td>
                                            <td className="p-3 text-right text-slate-800 font-medium">
                                                {formatCurrency(item.price * item.quantity)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="flex flex-col items-end space-y-2 pt-4 border-t border-slate-100">
                        <div className="flex justify-between w-full md:w-1/2 text-slate-600 text-sm">
                            <span>Subtotal:</span>
                            <span>{formatCurrency(selectedOrder.subtotal)}</span>
                        </div>
                        <div className="flex justify-between w-full md:w-1/2 text-slate-600 text-sm">
                            <span>Frete:</span>
                            <span>{formatCurrency(selectedOrder.shipping)}</span>
                        </div>
                        <div className="flex justify-between w-full md:w-1/2 text-lg font-bold text-slate-900 pt-2 border-t border-slate-200">
                            <span>Total:</span>
                            <span>{formatCurrency(selectedOrder.total)}</span>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex justify-between">
                     <button
                        onClick={() => handleExportCSV([selectedOrder], `pedido_${selectedOrder.id}.csv`)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                    >
                        <Download size={16} /> Baixar CSV Detalhado
                    </button>

                    <button 
                        onClick={() => setSelectedOrder(null)}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium rounded-lg transition-colors"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};