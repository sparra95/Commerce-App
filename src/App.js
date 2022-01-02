import React, { useState, useEffect } from "react"
import { commerce } from "./lib/commerce"
import { Products, Navbar, Cart, Checkout } from "./components"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

//////////////////////////////
// YT video timestamp: 3:10:51
//////////////////////////////

//////////////////////////////
// TODO:
// 1. Move commerce.js operations into a React Context, separate JSX file and remove prop drilling App > Cart > CartItem
// 2. Find optimizations by reducing renders and using React.memo()
// 3. Inside AddressForm.js , consider converting Select input fields into separate JSX components to clean up return statement (and practice!)

const App = () => {
	const [products, setProducts] = useState([])
	const [cart, setCart] = useState({})
	const [order, setOrder] = useState({})
	const [errorMessage, setErrorMessage] = useState("")
	
	// Fetch products from commerce.js
	const fetchProducts = async () => {
		const { data } = await commerce.products.list()
		
		setProducts(data)
	}
	
	// Fetch cart from commerce.js
	const fetchCart = async () => {
		setCart(await commerce.cart.retrieve())
	}
	
	// Add item and quantity to cart 
	const handleAddToCart = async (productId, quantity) => {
		const { cart } = await commerce.cart.add(productId, quantity)
		
		setCart(cart)
	}
	
	// Update item quantity to cart
	const handleUpdateCartQuantity = async (productId, quantity) => {
		const { cart } = await commerce.cart.update(productId, { quantity })
		
		setCart(cart)
	}
	
	// Remove from cart
	const handleRemoveFromCart = async (productId) => {
		const { cart } = await commerce.cart.remove(productId)
		
		setCart(cart)
	}
	
	// Remove all from cart
	const handleEmptyCart = async () => {
		const { cart } = await commerce.cart.empty()
		
		setCart(cart)
	}
	
	const refreshCart = async () => {
		const newCart = await commerce.cart.refresh().then((cart) => console.log(cart))
		
		console.log("REFRESHED CART: ")
		console.log(newCart)
		setCart(newCart)
	}
	
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
	
	console.log("CART: ")
	console.log(cart)
	
	return (
		<Router>
			<div>
				<Navbar totalItems={cart ? cart.total_items: 0} />
				<Routes>
					<Route path="/" element={<Products products={products} onAddToCart={handleAddToCart} />} />
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