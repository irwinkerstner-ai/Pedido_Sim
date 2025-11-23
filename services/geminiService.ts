import { GoogleGenAI } from "@google/genai";
import { CartItem } from '../types';

// Initialize Gemini Client
// Note: API_KEY must be set in the environment or provided securely.
// For this demo app running in a constrained environment, we access process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateOrderEmail = async (
  items: CartItem[], 
  username: string, 
  total: number,
  shipping: number
): Promise<string> => {
  
  if (!process.env.API_KEY) {
    return "Chave de API não configurada. Não foi possível gerar o e-mail automático via IA.";
  }

  const itemsList = items.map(item => `- ${item.quantity}x ${item.name} (R$ ${item.price.toFixed(2)})`).join('\n');

  const prompt = `
    Você é um assistente administrativo de um sistema de pedidos B2B.
    Escreva um e-mail formal e profissional de confirmação de pedido.
    
    Detalhes do Pedido:
    Cliente: ${username}
    Itens:
    ${itemsList}
    
    Frete: R$ ${shipping.toFixed(2)}
    Total Geral: R$ ${total.toFixed(2)}
    
    Instruções:
    - O tom deve ser profissional e cortês.
    - Mencione que uma planilha detalhada segue em anexo (simulado).
    - Mencione que o pedido está sendo processado pelo setor logístico.
    - Use formatação Markdown para destacar valores.
    - Assine como "Equipe EasyOrder".
    - Retorne APENAS o corpo do e-mail, sem cabeçalhos de assunto extras.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "Erro ao gerar e-mail.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ocorreu um erro ao comunicar com o assistente de IA para gerar o e-mail.";
  }
};