import React, { useState } from 'react';
import { User, ShippingRoute } from '../types';
import { Plus, Trash2, ArrowLeft, Users, Shield, User as UserIcon, Pencil, X, Truck } from 'lucide-react';

interface UserManagerProps {
  users: User[];
  shippingRoutes: ShippingRoute[];
  onAddUser: (user: User) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
  onBack: () => void;
}

export const UserManager: React.FC<UserManagerProps> = ({ users, shippingRoutes, onAddUser, onEditUser, onDeleteUser, onBack }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    cnpj: '',
    role: 'user' as 'admin' | 'user',
    city: '',
    state: '',
    regionId: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const startEditing = (user: User) => {
      setEditingId(user.id || null);
      setFormData({
          username: user.username,
          email: user.email,
          password: user.password || '',
          cnpj: user.cnpj || '',
          role: user.role,
          city: user.city || '',
          state: user.state || '',
          regionId: user.regionId || ''
      });
  };

  const cancelEditing = () => {
      setEditingId(null);
      setFormData({
          username: '',
          email: '',
          password: '',
          cnpj: '',
          role: 'user',
          city: '',
          state: '',
          regionId: ''
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) return;

    if (editingId) {
        // Update existing user
        const updatedUser: User = {
            id: editingId,
            username: formData.username,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            cnpj: formData.cnpj,
            city: formData.city,
            state: formData.state,
            regionId: formData.regionId
        };
        onEditUser(updatedUser);
    } else {
        // Create new user
        const newUser: User = {
            id: Date.now().toString(),
            username: formData.username,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            cnpj: formData.cnpj,
            city: formData.city,
            state: formData.state,
            regionId: formData.regionId
        };
        onAddUser(newUser);
    }
    
    // Reset form
    cancelEditing();
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Users className="text-blue-600" /> Gerenciamento de Usuários
            </h1>
            <p className="text-slate-500">Administre o acesso, as informações e a região de frete dos clientes.</p>
        </div>
        <button 
            onClick={onBack}
            className="flex items-center text-slate-600 hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm"
        >
            <ArrowLeft size={18} className="mr-2" /> Voltar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulário de Cadastro/Edição */}
        <div className="lg:col-span-1">
            <div className={`p-6 rounded-xl shadow-md border sticky top-24 transition-colors ${editingId ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}`}>
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-black/5">
                    <h2 className={`text-lg font-bold ${editingId ? 'text-amber-800' : 'text-slate-800'}`}>
                        {editingId ? 'Editar Usuário' : 'Novo Usuário'}
                    </h2>
                    {editingId && (
                        <button onClick={cancelEditing} className="text-xs text-amber-700 flex items-center gap-1 hover:underline">
                            <X size={12} /> Cancelar
                        </button>
                    )}
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Razão Social / Nome</label>
                        <input 
                            name="username" 
                            value={formData.username} 
                            onChange={handleChange} 
                            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" 
                            placeholder="Nome Completo"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                        <input 
                            name="email" 
                            type="email"
                            value={formData.email} 
                            onChange={handleChange} 
                            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" 
                            placeholder="usuario@empresa.com"
                            required
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">CNPJ (Opcional)</label>
                            <input 
                                name="cnpj" 
                                value={formData.cnpj} 
                                onChange={handleChange} 
                                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" 
                                placeholder="00.000..."
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
                            <input 
                                name="password" 
                                type="text"
                                value={formData.password} 
                                onChange={handleChange} 
                                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" 
                                placeholder="******"
                                required
                            />
                        </div>
                    </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Cidade</label>
                            <input name="city" value={formData.city} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
                            <input name="state" value={formData.state} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" maxLength={2} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Região de Frete</label>
                        <select 
                            name="regionId" 
                            value={formData.regionId} 
                            onChange={handleChange} 
                            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                            <option value="">Selecione...</option>
                            {shippingRoutes.map(route => (
                                <option key={route.id} value={route.id}>{route.name} ({route.percentage}%)</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Permissão</label>
                        <select 
                            name="role" 
                            value={formData.role} 
                            onChange={handleChange} 
                            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                            <option value="user">Usuário (Cliente)</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>

                    <button 
                        type="submit" 
                        className={`w-full text-white font-bold py-3 rounded-lg shadow transition-colors flex items-center justify-center gap-2 ${editingId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {editingId ? <><Pencil size={20} /> Atualizar Usuário</> : <><Plus size={20} /> Cadastrar Usuário</>}
                    </button>
                </form>
            </div>
        </div>

        {/* Tabela de Usuários */}
        <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase tracking-wider">
                                <th className="p-4">Usuário / Razão Social</th>
                                <th className="p-4">Contato / Região</th>
                                <th className="p-4">Função</th>
                                <th className="p-4 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((user) => {
                                const routeName = shippingRoutes.find(r => r.id === user.regionId)?.name || 'Sem Rota';
                                return (
                                <tr key={user.id || user.email} className={`transition-colors ${editingId === user.id ? 'bg-amber-50' : 'hover:bg-slate-50'}`}>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${editingId === user.id ? 'bg-amber-200 text-amber-800' : 'bg-blue-100 text-blue-700'}`}>
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-800">{user.username}</div>
                                                <div className="text-xs text-slate-500">
                                                    {user.cnpj || 'Sem CNPJ'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm text-slate-700">{user.email}</div>
                                        <div className="text-xs text-slate-500 flex items-center gap-1">
                                            <Truck size={10} /> {routeName}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {user.role === 'admin' ? (
                                            <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">
                                                <Shield size={12} /> Admin
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full font-medium">
                                                <UserIcon size={12} /> Cliente
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button 
                                                onClick={() => startEditing(user)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                title="Editar Usuário"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button 
                                                onClick={() => user.id && onDeleteUser(user.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                title="Excluir Usuário"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};