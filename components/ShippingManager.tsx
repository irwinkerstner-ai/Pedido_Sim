import React, { useState } from 'react';
import { ShippingRoute } from '../types';
import { Plus, Trash2, ArrowLeft, Truck, Map, Pencil, X } from 'lucide-react';

interface ShippingManagerProps {
  routes: ShippingRoute[];
  onAddRoute: (route: ShippingRoute) => void;
  onEditRoute: (route: ShippingRoute) => void;
  onDeleteRoute: (id: string) => void;
  onBack: () => void;
}

export const ShippingManager: React.FC<ShippingManagerProps> = ({ routes, onAddRoute, onEditRoute, onDeleteRoute, onBack }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    percentage: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const startEditing = (route: ShippingRoute) => {
    setEditingId(route.id);
    setFormData({
      name: route.name,
      percentage: route.percentage.toString()
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setFormData({ name: '', percentage: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.percentage) return;

    if (editingId) {
        // Edit existing route
        const updatedRoute: ShippingRoute = {
            id: editingId,
            name: formData.name,
            percentage: parseFloat(formData.percentage)
        };
        onEditRoute(updatedRoute);
    } else {
        // Create new route
        const newRoute: ShippingRoute = {
            id: Date.now().toString(),
            name: formData.name,
            percentage: parseFloat(formData.percentage)
        };
        onAddRoute(newRoute);
    }

    cancelEditing();
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Truck className="text-blue-600" /> Tabela de Frete
            </h1>
            <p className="text-slate-500">Gerencie as rotas e os percentuais de frete aplicados sobre o valor do pedido.</p>
        </div>
        <button 
            onClick={onBack}
            className="flex items-center text-slate-600 hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm"
        >
            <ArrowLeft size={18} className="mr-2" /> Voltar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Formulário */}
        <div className="md:col-span-1">
            <div className={`p-6 rounded-xl shadow-md border sticky top-24 transition-colors ${editingId ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}`}>
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-black/5">
                    <h2 className={`text-lg font-bold ${editingId ? 'text-amber-800' : 'text-slate-800'}`}>
                        {editingId ? 'Editar Rota' : 'Nova Rota'}
                    </h2>
                    {editingId && (
                        <button onClick={cancelEditing} className="text-xs text-amber-700 flex items-center gap-1 hover:underline">
                            <X size={12} /> Cancelar
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Região/Rota</label>
                        <div className="relative">
                            <Map className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                            <input 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                className="w-full pl-9 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" 
                                placeholder="Ex: Interior SP"
                                required
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Percentual (%)</label>
                        <input 
                            name="percentage" 
                            type="number" 
                            step="0.1" 
                            min="0"
                            value={formData.percentage} 
                            onChange={handleChange} 
                            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" 
                            placeholder="Ex: 5.5"
                            required
                        />
                        <p className="text-xs text-slate-500 mt-1">Será aplicado sobre o total do pedido.</p>
                    </div>

                    <button 
                        type="submit" 
                        className={`w-full text-white font-bold py-3 rounded-lg shadow transition-colors flex items-center justify-center gap-2 ${editingId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                         {editingId ? <><Pencil size={20} /> Atualizar Rota</> : <><Plus size={20} /> Adicionar Rota</>}
                    </button>
                </form>
            </div>
        </div>

        {/* Lista */}
        <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase tracking-wider">
                            <th className="p-4">Região / Rota</th>
                            <th className="p-4 text-right">Percentual</th>
                            <th className="p-4 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {routes.map((route) => (
                            <tr key={route.id} className={`transition-colors ${editingId === route.id ? 'bg-amber-50' : 'hover:bg-slate-50'}`}>
                                <td className="p-4 font-medium text-slate-800">
                                    {route.name}
                                </td>
                                <td className="p-4 text-right text-blue-600 font-bold">
                                    {route.percentage.toFixed(1)}%
                                </td>
                                <td className="p-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button 
                                            onClick={() => startEditing(route)}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                            title="Editar Rota"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button 
                                            onClick={() => onDeleteRoute(route.id)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            title="Remover Rota"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {routes.length === 0 && (
                            <tr>
                                <td colSpan={3} className="p-8 text-center text-slate-500">
                                    Nenhuma rota cadastrada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};