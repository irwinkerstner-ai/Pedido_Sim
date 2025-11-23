import React from 'react';
import { Product } from '../types';
import { formatCurrency } from '../utils/formatters';
import { Plus, Minus, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  quantity: number;
  onUpdateQuantity: (id: string, delta: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, quantity, onUpdateQuantity }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden bg-slate-200">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-slate-700">
          {product.category}
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-lg text-slate-800 mb-1 leading-tight">{product.name}</h3>
        <p className="text-sm text-slate-500 mb-4">Unidade: {product.unit}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">{formatCurrency(product.price)}</span>
          
          <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-slate-200">
            <button 
              onClick={() => onUpdateQuantity(product.id, -1)}
              className={`p-1.5 rounded-md transition-colors ${quantity > 0 ? 'bg-white shadow-sm text-red-500 hover:bg-red-50' : 'text-slate-300 cursor-not-allowed'}`}
              disabled={quantity === 0}
            >
              <Minus size={16} />
            </button>
            
            <span className={`w-6 text-center font-semibold ${quantity > 0 ? 'text-slate-900' : 'text-slate-400'}`}>
              {quantity}
            </span>
            
            <button 
              onClick={() => onUpdateQuantity(product.id, 1)}
              className="p-1.5 rounded-md bg-white shadow-sm text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
      {quantity > 0 && (
        <div className="bg-blue-50 px-4 py-2 text-xs text-blue-700 flex justify-between items-center border-t border-blue-100">
          <span>Subtotal:</span>
          <span className="font-bold">{formatCurrency(quantity * product.price)}</span>
        </div>
      )}
    </div>
  );
};