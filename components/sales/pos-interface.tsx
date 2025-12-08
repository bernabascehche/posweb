"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Minus, CreditCard, X } from "lucide-react"
import { useState } from "react"
import { useApi } from "@/hooks/use-api"
import { inventoryAPI } from "@/lib/api-client"
import type { ProductTemplate } from "@/lib/types"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  subtotal: number
  image?: string
}

export function POSInterface() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [showPayment, setShowPayment] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("card")
  const [customerName, setCustomerName] = useState("Guest")
  const { data: products, loading, error } = useApi<ProductTemplate[]>(() => inventoryAPI.getProducts())

  // Extract unique categories from products
  const categories = products 
    ? [...new Set((products as ProductTemplate[])
        .filter(p => p.category?.name)
        .map((p) => p.category?.name || "Uncategorized"))]
    : []

  // Set default category if not set
  if (categories.length > 0 && !selectedCategory) {
    setSelectedCategory(categories[0])
  }

  const filteredProducts =
    products?.filter((p: ProductTemplate) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
      const productCategory = p.category?.name || "Uncategorized"
      const matchesCategory = !selectedCategory || productCategory === selectedCategory
      return matchesSearch && matchesCategory
    }) || []

  const addToCart = (product: ProductTemplate) => {
    const existingItem = cart.find((item) => item.id === product.id)
    const availableQty = product.qty_available || 0

    if (existingItem) {
      if (existingItem.quantity < availableQty) {
        setCart(
          cart.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                  subtotal: (item.quantity + 1) * item.price,
                }
              : item,
          ),
        )
      }
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.list_price,
          quantity: 1,
          subtotal: product.list_price,
          image: product.image_url,
        },
      ])
    }
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
    } else {
      setCart(
        cart.map((item) =>
          item.id === id
            ? {
                ...item,
                quantity,
                subtotal: quantity * item.price,
              }
            : item,
        ),
      )
    }
  }

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  const handleCheckout = () => {
    if (cart.length === 0) return
    setShowPayment(true)
  }

  const handleComplete = () => {
    alert(`Payment of $${total.toFixed(2)} completed via ${paymentMethod}!`)
    setCart([])
    setShowPayment(false)
    setCustomerName("Guest")
  }

  const handleCancel = () => {
    setShowPayment(false)
  }

  return (
    <div className="p-0 md:p-4 bg-background min-h-screen">
      <div className="flex flex-col lg:flex-row gap-4 h-full">
        {/* Left: Products Section */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white p-4 md:p-6 rounded-lg mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">POS System</h1>

            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" size={18} />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-full border-primary bg-gray-50 focus:ring-primary focus:ring-2"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-foreground hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 bg-white p-4 md:p-6 rounded-lg overflow-y-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {loading ? (
                <div className="col-span-full p-8 text-center text-muted-foreground">Loading products...</div>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product: ProductTemplate) => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    disabled={!product.qty_available || product.qty_available === 0}
                    className="group"
                  >
                    <Card className="p-3 hover:shadow-lg transition-all hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed h-full flex flex-col items-center text-center">
                      <div className="text-4xl mb-2">{product.image_url || "📦"}</div>
                      <h3 className="font-semibold text-sm text-foreground group-hover:text-primary line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {product.qty_available || 0} in stock
                      </p>
                      <p className="text-primary font-bold text-lg mt-auto pt-2">${product.list_price.toFixed(2)}</p>
                    </Card>
                  </button>
                ))
              ) : (
                <div className="col-span-full p-8 text-center text-muted-foreground">No products found</div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="w-full lg:w-96 flex flex-col">
          <Card className="flex-1 p-4 md:p-6 bg-white flex flex-col">
            {/* Header */}
            <div className="mb-4 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-foreground mb-2">Current Order</h2>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  {customerName.charAt(0).toUpperCase()}
                </div>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Guest"
                  className="flex-1 px-3 py-1 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Order Items */}
            <div className="flex-1 overflow-y-auto mb-4 max-h-96 space-y-2">
              {cart.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">No items added</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg group">
                    <span className="text-2xl">{item.image || "📦"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} each</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-foreground">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-sm text-primary">${item.subtotal.toFixed(2)}</p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Summary */}
            {cart.length > 0 && (
              <>
                <div className="space-y-2 border-t border-gray-200 pt-4 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-primary border-t border-gray-200 pt-3">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => setCart([])}
                    variant="outline"
                    className="flex-1 rounded-full border-primary text-primary hover:bg-primary/5"
                  >
                    Clear
                  </Button>
                  <Button
                    onClick={handleCheckout}
                    className="flex-1 bg-primary text-white hover:bg-primary/90 rounded-full font-bold py-6"
                  >
                    <CreditCard className="mr-2" size={18} />
                    Proceed
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6 md:p-8 bg-white">
            <h2 className="text-2xl font-bold text-foreground mb-6">Select Payment Method</h2>

            <div className="space-y-3 mb-6">
              <label
                className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-primary/5"
                style={{ borderColor: paymentMethod === "card" ? "#E20074" : "#d1d5db" }}
              >
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value as "card")}
                  className="mr-3 w-4 h-4"
                  style={{ accentColor: "#E20074" }}
                />
                <div className="text-left">
                  <span className="font-semibold text-foreground block">Card Payment</span>
                  <span className="text-xs text-muted-foreground">Credit or Debit Card</span>
                </div>
              </label>

              <label
                className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer transition-all hover:bg-gray-50"
                style={{ borderColor: paymentMethod === "cash" ? "#E20074" : "#d1d5db" }}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={(e) => setPaymentMethod(e.target.value as "cash")}
                  className="mr-3 w-4 h-4"
                  style={{ accentColor: "#E20074" }}
                />
                <div className="text-left">
                  <span className="font-semibold text-foreground block">Cash Payment</span>
                  <span className="text-xs text-muted-foreground">Pay with cash</span>
                </div>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1 rounded-full py-6 border-primary text-primary hover:bg-primary/5 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={handleComplete}
                className="flex-1 bg-primary text-white hover:bg-primary/90 rounded-full py-6 font-bold"
              >
                Confirm Payment
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
