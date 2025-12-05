import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    restaurantId: string;
    restaurantName: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (menuItemId: string) => void;
    updateQuantity: (menuItemId: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addItem = (item: CartItem) => {
        setItems((prev) => {
            // Check if item from different restaurant
            if (prev.length > 0 && prev[0].restaurantId !== item.restaurantId) {
                if (!confirm('Adding items from a different restaurant will clear your cart. Continue?')) {
                    return prev;
                }
                return [item];
            }

            const existing = prev.find((i) => i.menuItemId === item.menuItemId);
            if (existing) {
                return prev.map((i) =>
                    i.menuItemId === item.menuItemId ? { ...i, quantity: i.quantity + item.quantity } : i
                );
            }
            return [...prev, item];
        });
    };

    const removeItem = (menuItemId: string) => {
        setItems((prev) => prev.filter((i) => i.menuItemId !== menuItemId));
    };

    const updateQuantity = (menuItemId: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(menuItemId);
            return;
        }
        setItems((prev) =>
            prev.map((i) => (i.menuItemId === menuItemId ? { ...i, quantity } : i))
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const getTotal = () => {
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    const getItemCount = () => {
        return items.reduce((sum, item) => sum + item.quantity, 0);
    };

    return (
        <CartContext.Provider
            value={{ items, addItem, removeItem, updateQuantity, clearCart, getTotal, getItemCount }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};
