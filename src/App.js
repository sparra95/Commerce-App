import React, { useState, useEffect, useCallback } from "react"
import { commerce } from "./lib/commerce"
import { Products, Navbar, Cart, Checkout } from "./components"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

const App = () => {
	const [products, setProducts] = useState([])
	const [cart, setCart] = useState({})
	const [order, setOrder] = useState({})
	const [errorMessage, setErrorMessage] = useState("")
	
	// Fetch products from commerce.js
	const fetchProducts = async () => {
		try {
			const { data } = await commerce.products.list()
			setProducts(data)

		} catch (error) {
			console.log(error)
		}
	}
	
	// Fetch cart from commerce.js
	const fetchCart = async () => {
		try {
			setCart(await commerce.cart.retrieve())

		} catch (error) {
			console.log(error)
		}
	}
	
	// Add item to cart 
	const handleAddToCart = async (productId, quantity) => {
		try {
			const { cart } = await commerce.cart.add(productId, quantity)
			setCart(cart)

		} catch (error) {
			console.log(error)
		}
	}
	
	// Update item quantity to cart
	const handleUpdateCartQuantity = async (productId, quantity) => {
		try {
			const { cart } = await commerce.cart.update(productId, { quantity })
			setCart(cart)

		} catch (error) {
			console.log(error)
		}
	}
	
	// Remove item from cart
	const handleRemoveFromCart = async (productId) => {
		try {
			const { cart } = await commerce.cart.remove(productId)
			setCart(cart)

		} catch (error) {
			console.log(error)
		}
	}
	
	// Remove all items from cart
	const handleEmptyCart = async () => {
		try {
			const { cart } = await commerce.cart.empty()
			setCart(cart)

		} catch (error) {
			console.log(error)
		}
	}
	
	// Refresh cart
	const refreshCart = async () => {
		try {
			const newCart = await commerce.cart.refresh().then((cart) => console.log(cart))
			setCart(newCart)
			
		} catch (error) {
			console.log(error)
		}

	}
	
	// Capture order, refresh cart
	const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
		try {
			const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder)
			setOrder(incomingOrder)
			refreshCart()

		} catch (error) {
			setErrorMessage(error.data.error.message)
			console.log(error.data.error.message)
		}
	}
	
	// Fetch products and cart on component start
	useEffect(() => {
		fetchProducts()
		fetchCart()
	}, [])

	// Memoize functions to prevent unnecessary rerenders
	const memoizedHandleAddToCart = useCallback(handleAddToCart, [])
	
	return (
		<Router>
			<div>
				<Navbar totalItems={cart ? cart.total_items: 0} />
				<Routes>
					<Route path="/" element={
						<Products 
							products={products} 
							onAddToCart={memoizedHandleAddToCart} 
						/>} 
					/>
					<Route path="/cart" element={
						<Cart
							cart={cart}
							handleUpdateCartQuantity={handleUpdateCartQuantity}
							handleRemoveFromCart={handleRemoveFromCart}
							handleEmptyCart={handleEmptyCart}
						/>}
					/>
					<Route path="/checkout" element={
						<Checkout
							cart={cart}
							order={order}
							onCaptureCheckout={handleCaptureCheckout}
							error={errorMessage}
						/>}
					/>
				</Routes>
			</div>
		</Router>
	)
}

export default App