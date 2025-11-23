import React, { useState } from 'react';
import { Product } from '../types';
import { formatCurrency } from '../utils/formatters';
import { Plus, Trash2, ArrowLeft, Package, Image as ImageIcon } from 'lucide-react';

interface ProductManagerProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onBack: () => void;
}

export const ProductManager: React.FC<ProductManagerProps> = ({ products, onAddProduct, onDeleteProduct, onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    unit: 'un',
    image: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category || 'Geral',
      price: parseFloat(formData.price.replace(',', '.')),
      unit: formData.unit,
      image: formData.image || `https://picsum.photos/seed/${Date.now()}/300/300`
    };

    onAddProduct(newProduct);
    setFormData({ name: '', category: '', price: '', unit: 'un', image: '' });
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Package className="text-blue-600" /> Gerenciamento de Produtos
            </h1>
            <p className="text-slate-500">Cadastre novos itens ou remova existentes do catálogo.</p>
        </div>
        <button 
            onClick={onBack}
            className="flex items-center text-slate-600 hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm"
        >
            <ArrowLeft size={18} className="mr-2" /> Voltar para Loja
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulário de Cadastro */}
        <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 sticky top-24">
                <h2 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Novo Produto</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Produto</label>
                        <input 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                            placeholder="Ex: Teclado USB"
                            required
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Preço (R$)</label>
                            <input 
                                name="price" 
                                type="number" 
                                step="0.01" 
                                value={formData.price} 
                                onChange={handleChange} 
                                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                                placeholder="0.00"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Unidade</label>
                            <select 
                                name="unit" 
                                value={formData.unit} 
                                onChange={handleChange} 
                                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            >
                                <option value="un">Unidade (un)</option>
                                <option value="cx">Caixa (cx)</option>
                                <option value="kg">Quilo (kg)</option>
                                <option value="mt">Metro (mt)</option>
                                <option value="pc">Pacote (pc)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
                        <input 
                            name="category" 
                            value={formData.category} 
                            onChange={handleChange} 
                            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                            placeholder="Ex: Periféricos"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">URL da Imagem (Opcional)</label>
                        <div className="relative">
                            <ImageIcon className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                            <input 
                                name="image" 
                                value={formData.image} 
                                onChange={handleChange} 
                                className="w-full pl-9 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                                placeholder="https://..."
                            />
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Se vazio, uma imagem aleatória será gerada.</p>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus size={20} /> Cadastrar Produto
                    </button>
                </form>
            </div>
        </div>

        {/* Tabela de Produtos */}
        <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase tracking-wider">
                                <th className="p-4 w-20">Img</th>
                                <th className="p-4">Produto</th>
                                <th className="p-4">Categoria</th>
                                <th className="p-4 text-right">Preço</th>
                                <th className="p-4 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                                            <img src={product.image} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-semibold text-slate-800">{product.name}</div>
                                        <div className="text-xs text-slate-500">ID: {product.id} • Un: {product.unit}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-block bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-medium text-slate-900">
                                        {formatCurrency(product.price)}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={() => onDeleteProduct(product.id)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            title="Excluir Produto"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">
                                        Nenhum produto cadastrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};