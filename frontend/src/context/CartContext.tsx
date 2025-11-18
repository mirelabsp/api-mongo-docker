import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

export interface CartItem {
    _id: string;
    title: string;
    price: number;
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    cartTotal: number;
    cartCount: number;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Calcula o total e a contagem total de itens no carrinho
    const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const addItem = useCallback((item: CartItem) => {
        setCartItems(prevItems => {
            const exists = prevItems.find(i => i._id === item._id);
            if (exists) {
                
                return prevItems.map(i =>
                    i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
                );
            } else {
               
                return [...prevItems, { ...item, quantity: 1 }];
            }
        });
    }, []);

    const removeItem = useCallback((itemId: string) => {
        setCartItems(prevItems => prevItems.filter(item => item._id !== itemId));
    }, []);

    const updateQuantity = useCallback((itemId: string, quantity: number) => {
        setCartItems(prevItems => {
            if (quantity <= 0) return prevItems.filter(item => item._id !== itemId);
            return prevItems.map(item =>
                item._id === itemId ? { ...item, quantity } : item
            );
        });
    }, []);

    const clearCart = useCallback(() => setCartItems([]), []);

    return (
        <CartContext.Provider value={{ cartItems, addItem, removeItem, updateQuantity, cartTotal, cartCount, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart deve ser usado dentro de um CartProvider');
    }
    return context;
};
