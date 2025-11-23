import React, { useState } from 'react';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';

interface ResetPasswordProps {
  onReset: (email: string) => void;
  onBack: () => void;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ onReset, onBack }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
        onReset(email);
        setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-slate-800 p-8 text-center relative">
          <button 
                onClick={onBack}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-slate-700 rounded-full text-white hover:bg-slate-600 transition-colors"
            >
                <ArrowLeft size={20} />
          </button>
          <div className="mx-auto w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-2">
             <KeyRound className="text-white w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Recuperar Senha</h2>
        </div>

        {!submitted ? (
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <p className="text-slate-600 text-sm text-center mb-4">
                Digite o e-mail cadastrado. Enviaremos um link para você redefinir sua senha.
            </p>
            
            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">E-mail</label>
                <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    placeholder="seu@email.com"
                />
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all"
            >
                Enviar Link de Recuperação
            </button>
            </form>
        ) : (
            <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <Mail size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">E-mail Enviado!</h3>
                <p className="text-slate-500 text-sm">
                    Verifique sua caixa de entrada (e spam) no endereço <strong>{email}</strong> para redefinir sua senha.
                </p>
                <button 
                    onClick={onBack}
                    className="mt-4 text-blue-600 font-semibold hover:underline"
                >
                    Voltar para Login
                </button>
            </div>
        )}
      </div>
    </div>
  );
};