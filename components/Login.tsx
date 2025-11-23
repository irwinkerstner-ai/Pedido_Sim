import React, { useState } from 'react';
import { User } from '../types';
import { Lock, User as UserIcon, ArrowRight, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
  onRegisterClick: () => void;
  onForgotPasswordClick: () => void;
  users: User[]; // Received for validation
}

export const Login: React.FC<LoginProps> = ({ onLogin, onRegisterClick, onForgotPasswordClick, users }) => {
  const [identifier, setIdentifier] = useState(''); // Can be username or email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    // Find user in the "database"
    // We check against username OR email
    const foundUser = users.find(u => 
        (u.username.toLowerCase() === identifier.toLowerCase() || 
         u.email.toLowerCase() === identifier.toLowerCase()) && 
        u.password === password
    );

    if (foundUser) {
        onLogin(foundUser);
    } else {
        setError('Usuário ou senha incorretos.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4">
             <UserIcon className="text-white w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-white">EasyOrder</h2>
          <p className="text-blue-100 mt-2">Acesse para realizar seus pedidos</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Usuário ou E-mail</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                placeholder="Seu nome de usuário"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700 ml-1">Senha</label>
                <button 
                    type="button" 
                    onClick={onForgotPasswordClick}
                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                >
                    Esqueceu a senha?
                </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Entrar no Sistema</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
                Não tem uma conta?{' '}
                <button 
                    type="button" 
                    onClick={onRegisterClick}
                    className="text-blue-600 font-bold hover:underline"
                >
                    Cadastre-se
                </button>
            </p>
             <p className="text-xs text-slate-400 mt-4">
                Login de teste: <strong>admin</strong> / senha: <strong>admin</strong>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};