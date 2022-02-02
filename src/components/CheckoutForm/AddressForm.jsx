import React, { useState, useEffect } from "react"
import { Button, Grid, Typography } from "@material-ui/core"
import { useForm, FormProvider } from "react-hook-form"
import { Link } from "react-router-dom"
import FormInput from "./FormInput"
import FormSelect from "./FormSelect"

import { commerce } from "../../lib/commerce"

const AddressForm = ({ checkoutToken, next }) => {
	const [shippingCountries, setShippingCountries] = useState([])
	const [shippingCountry, setShippingCountry] = useState("")
	const [shippingSubdivisions, setShippingSubdivisions] = useState([])
	const [shippingSubdivision, setShippingSubdivision] = useState("")
	const [shippingOptions, setShippingOptions] = useState([])
	const [shippingOption, setShippingOption] = useState("")
	const methods = useForm()
	
	const countries = Object.entries(shippingCountries).map(([code, name]) => ({ id: code, label: name }))
	const subdivisions = Object.entries(shippingSubdivisions).map(([code, name]) => ({ id: code, label: name }))
	const options = shippingOptions.map((sO) => ({ id: sO.id, label: `${sO.description} - (${sO.price.formatted_with_symbol})` }))
	
	const fetchShippingCountries = async (checkoutTokenId) => {
		try {
			const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId)
		
			setShippingCountries(countries)
			setShippingCountry(Object.keys(countries)[0])
		} catch (error) {
			console.log(error) 	
		}
	}
	
	const fetchSubdivisions = async (countryCode) => {
		try {
			const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode)
		
			setShippingSubdivisions(subdivisions)
			setShippingSubdivision(Object.keys(subdivisions)[0])
		} catch (error) {
			console.log(error)  
		}
	}
	
	const fetchShippingOptions = async (checkoutTokenId, country, region = null) => {
		try {
			const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region })
			
			setShippingOptions(options)
			setShippingOption(options[0].id)
		} catch (error) {
			console.log(error) 
		}
	}
	
	useEffect(() => {
		fetchShippingCountries(checkoutToken.id)
	}, [])
	
	useEffect(() => {
		if (shippingCountry) fetchSubdivisions(shippingCountry)
	}, [shippingCountry])
	
	useEffect(() => {
		if (shippingSubdivision) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision)
	}, [shippingSubdivision])
	
	return (
		<>
			<Typography variant="h6" gutterBottom>Shipping Address</Typography>

			{/** Form */}
			<FormProvider {...methods}>
				<form onSubmit={methods.handleSubmit((data) => next({ ...data, shippingCountry, shippingSubdivision, shippingOption }))}>
					<Grid container spacing={3}>

						{/** Inputs */}
						<FormInput name="firstName" label="First name" />
						<FormInput name="lastName" label="Last name" />
						<FormInput name="address1" label="Address" />
						<FormInput name="email" label="Email" />
						<FormInput name="city" label="City" />
						<FormInput name="zip" label="ZIP / Postal code" />

						{/** Select country, subdivision, shipping options */}
						<FormSelect 
							label={"Shipping Country"} 
							currentValue={shippingCountry} 
							selectOptions={countries} 
							setValue={setShippingCountry} 
						/>

						<FormSelect 
							label={"Shipping Subdivision"} 
							currentValue={shippingSubdivision} 
							selectOptions={subdivisions} 
							setValue={setShippingSubdivision} 
						/>

						<FormSelect 
							label={"Shipping Options"} 
							currentValue={shippingOption} 
							selectOptions={options} 
							setValue={setShippingOption} 
						/>
						
					</Grid>

					<br />
					
					{/** Buttons */}
					<div style={{ display: "flex", justifyContent: "space-between" }}>
						<Button component={Link} to="/cart" variant="outlined">Back to Cart</Button>
						<Button type="submit" variant="contained" color="primary">Next</Button>
					</div>
				</form>
			</FormProvider>
		</>
	)
}

export default AddressForm