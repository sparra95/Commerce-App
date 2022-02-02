import React from "react"
import { Typography, Button, Divider } from "@material-ui/core"
import { Elements, CardElement, ElementsConsumer } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import Review from "./Review"

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)

const PaymentForm = ({ shippingData, checkoutToken, nextStep, backStep, onCaptureCheckout }) => {
	
	const handleSubmit = async (event, elements, stripe) => {
		event.preventDefault()
		
		if (!stripe || !elements) return
		
		// Get Stripe elements
		const cardElement = elements.getElement(CardElement)
		const { error, paymentMethod } = await stripe.createPaymentMethod({ type: "card", card: cardElement })
		
		if (error) return console.log(error)

		// Prepare data for Strpe payment process
		const orderData = {
			line_items: checkoutToken.live.line_items,
			customer: { firstname: shippingData.firstName, lastname: shippingData.lastName, email: shippingData.email },
			shipping: {
				name: "Primary",
				street: shippingData.address1,
				town_city: shippingData.city,
				county_state: shippingData.shippingSubdivision,
				postal_zip_code: shippingData.zip,
				country: shippingData.shippingCountry
			},
			fulfillment: { shipping_method: shippingData.shippingOption },
			payment: {
				gateway: "stripe",
				stripe: { payment_method_id: paymentMethod.id }
			}
		}
		
		onCaptureCheckout(checkoutToken.id, orderData)

		nextStep()
	}
	
	
	return (
		<>
			<Review checkoutToken={checkoutToken} />
			<Divider />
			<Typography variant="h6" gutterBottom style={{ margin: "0" }}>Payment method</Typography>
			<Typography variant="caption" gutterBottom style={{ color: "red", display: "block", marginBottom: "1rem" }}>
				Payments are in Test Mode. Please use: 4242 4242 4242 4242 EXP 04/24 242 42424
			</Typography>
			<Elements stripe={stripePromise}>
				
				{/** Capture payment info */}
				<ElementsConsumer>
					{({ elements, stripe }) => (
						<form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
							<CardElement />

							<br /><br />

							{/** Buttons */}
							<div style={{ display: "flex", justifyContent: "space-between" }}>
								<Button variant="outlined" onClick={backStep}>Back</Button>
								<Button type="submit" variant="contained" disabled={!stripe} color="primary">
									Pay {checkoutToken.live.subtotal.formatted_with_symbol}
								</Button>
							</div>
						</form>
					)}
				</ElementsConsumer>
			</Elements>
		</>
	)
}

export default PaymentForm