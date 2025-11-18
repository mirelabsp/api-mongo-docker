export const formatPrice = (price: number): string => {
  if (typeof price !== 'number' || isNaN(price)) { price = 0; }
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
};