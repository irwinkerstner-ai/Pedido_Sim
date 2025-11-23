import React, { useState } from 'react';
import { User, ShippingRoute } from '../types';
import { UserPlus, ArrowLeft, Building2, MapPin, Mail, Lock, FileText, Truck } from 'lucide-react';

interface RegisterProps {
  onRegister: (user: User) => void;
  onBack: () => void;
  shippingRoutes: ShippingRoute[];
}

export const Register: React.FC<RegisterProps> = ({ onRegister, onBack, shippingRoutes }) => {
  const [formData, setFormData] = useState({
    razaoSocial: '',
    cnpj: '',
    email: '',
    address: '',
    city: '',
    cep: '',
    state: '',
    password: '',
    confirmPassword: '',
    regionId: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (Object.values(formData).some(val => (val as string).trim() === '')) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não conferem.');
      return;
    }

    if (formData.password.length < 3) {
      setError('A senha deve ter pelo menos 3 caracteres.');
      return;
    }

    // Register User
    const newUser: User = {
      username: formData.razaoSocial,
      email: formData.email,
      role: 'user',
      cnpj: formData.cnpj,
      address: formData.address,
      city: formData.city,
      cep: formData.cep,
      state: formData.state,
      regionId: formData.regionId
    };

    onRegister(newUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-6 text-center relative">
            <button 
                onClick={onBack}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-blue-500 rounded-full text-white hover:bg-blue-400 transition-colors"
                title="Voltar"
            >
                <ArrowLeft size={20} />
            </button>
            <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                <UserPlus /> Novo Cadastro
            </h2>
            <p className="text-blue-100 text-sm mt-1">Preencha os dados da sua empresa</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Empresa Info */}
            <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-600 uppercase">Dados da Empresa</label>
            </div>

            <div className="space-y-1">
                <label className="text-sm text-slate-600">Razão Social</label>
                <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                    <input name="razaoSocial" value={formData.razaoSocial} onChange={handleChange} className="w-full pl-9 p-2 rounded border border-slate-300 focus:border-blue-500 outline-none" placeholder="Nome da Empresa" />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-sm text-slate-600">CNPJ</label>
                <div className="relative">
                    <FileText className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                    <input name="cnpj" value={formData.cnpj} onChange={handleChange} className="w-full pl-9 p-2 rounded border border-slate-300 focus:border-blue-500 outline-none" placeholder="00.000.000/0000-00" />
                </div>
            </div>

            <div className="space-y-1 md:col-span-2">
                <label className="text-sm text-slate-600">E-mail Corporativo</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-9 p-2 rounded border border-slate-300 focus:border-blue-500 outline-none" placeholder="compras@empresa.com" />
                </div>
            </div>

            {/* Endereço Info */}
             <div className="space-y-2 md:col-span-2 mt-2">
                <label className="text-xs font-bold text-slate-600 uppercase">Endereço de Entrega</label>
            </div>

            <div className="space-y-1 md:col-span-2">
                <label className="text-sm text-slate-600">Logradouro</label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                    <input name="address" value={formData.address} onChange={handleChange} className="w-full pl-9 p-2 rounded border border-slate-300 focus:border-blue-500 outline-none" placeholder="Rua, Número, Bairro" />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-sm text-slate-600">Cidade</label>
                <input name="city" value={formData.city} onChange={handleChange} className="w-full p-2 rounded border border-slate-300 focus:border-blue-500 outline-none" placeholder="Cidade" />
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                    <label className="text-sm text-slate-600">CEP</label>
                    <input name="cep" value={formData.cep} onChange={handleChange} className="w-full p-2 rounded border border-slate-300 focus:border-blue-500 outline-none" placeholder="00000-000" />
                </div>
                <div className="space-y-1">
                    <label className="text-sm text-slate-600">Estado</label>
                    <select name="state" value={formData.state} onChange={handleChange} className="w-full p-2 rounded border border-slate-300 focus:border-blue-500 outline-none bg-white">
                        <option value="">UF</option>
                        <option value="SP">SP</option>
                        <option value="RJ">RJ</option>
                        <option value="MG">MG</option>
                        <option value="RS">RS</option>
                        <option value="PR">PR</option>
                        <option value="SC">SC</option>
                        <option value="BA">BA</option>
                        <option value="OTHER">Outro</option>
                    </select>
                </div>
            </div>
            
            <div className="space-y-1 md:col-span-2">
                <label className="text-sm text-slate-600">Região de Frete</label>
                <div className="relative">
                    <Truck className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                    <select name="regionId" value={formData.regionId} onChange={handleChange} className="w-full pl-9 p-2 rounded border border-slate-300 focus:border-blue-500 outline-none bg-white">
                        <option value="">Selecione sua Região</option>
                        {shippingRoutes.map(route => (
                            <option key={route.id} value={route.id}>{route.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Security */}
            <div className="space-y-2 md:col-span-2 mt-2">
                <label className="text-xs font-bold text-slate-600 uppercase">Segurança</label>
            </div>

            <div className="space-y-1">
                <label className="text-sm text-slate-600">Senha</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full pl-9 p-2 rounded border border-slate-300 focus:border-blue-500 outline-none" placeholder="••••••••" />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-sm text-slate-600">Confirmar Senha</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full pl-9 p-2 rounded border border-slate-300 focus:border-blue-500 outline-none" placeholder="••••••••" />
                </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-blue-600/30 transition-all mt-4"
          >
            Cadastrar e Entrar
          </button>
        </form>
      </div>
    </div>
  );
};