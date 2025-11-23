export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const generateCSV = (items: any[]): string => {
  const headers = ["ID", "Produto", "Categoria", "Quantidade", "Preço Unitário", "Subtotal"];
  
  const rows = items.map(item => [
    item.id,
    `"${item.name}"`, // Quote strings to handle commas
    item.category,
    item.quantity,
    item.price.toFixed(2),
    (item.quantity * item.price).toFixed(2)
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');

  return `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;
};