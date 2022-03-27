import React from "react"
import { Grid, CircularProgress } from "@material-ui/core"

import Product from "./Product/Product"
import useStyles from "./styles"

const Products = ({ products, onAddToCart }) => {
	const classes = useStyles()

	return (
		<main className={classes.content}>
		<div className={classes.toolbar} />
			{ products.length === 0 
				? (<div className={classes.spinner}><CircularProgress size={80} thickness={2} /></div>)
				: (<Grid container justify="center" spacing={4}>
					{products.map((product) => (
						<Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
							<Product product={product} onAddToCart={onAddToCart} />
						</Grid>														
					))}
				</Grid>)
			}
		</main>
	)
}

export default React.memo(Products)