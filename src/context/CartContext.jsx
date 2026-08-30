import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart')) || []
    } catch {
      return []
    }
  })
  const [open, setOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = (product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product === product._id)
      if (existing) {
        return prev.map((i) =>
          i.product === product._id ? { ...i, qty: Math.min(i.qty + qty, 99) } : i
        )
      }
      return [
        ...prev,
        {
          product: product._id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          image: product.images?.[0] || '',
          qty,
        },
      ]
    })
    setOpen(true)
  }

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.product !== id))

  const updateQty = (id, qty) =>
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.product !== id)
        : prev.map((i) => (i.product === id ? { ...i, qty: Math.min(qty, 99) } : i))
    )

  const clearCart = () => setItems([])

  const count = items.reduce((sum, i) => sum + i.qty, 0)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <CartContext.Provider
      value={{ items, open, setOpen, addItem, removeItem, updateQty, clearCart, count, subtotal }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
