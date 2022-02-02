import React, { memo } from "react"
import { Card, CardMedia, CardContent, CardActions, Typography, IconButton } from "@material-ui/core"
import { AddShoppingCart } from "@material-ui/icons"
import useStyles from "./styles"

const Product = ({ product, onAddToCart }) => {
	const classes = useStyles()

	console.log('rendering ', product.name)
	
	return (
		<Card className={classes.root}>
			
			{/** Image */}
			<CardMedia className={classes.media} image={product.image.url} title={product.name} />
			
			<CardContent>

				{/** Name and price */}
				<div className={classes.cardContent}>
					<Typography variant="h5" gutterBottom>
						{product.name}
					</Typography>
					<Typography variant="h5" gutterBottom>
						{product.price.formatted_with_symbol}
					</Typography>
				</div>

				{/** Description */}
				<Typography dangerouslySetInnerHTML={{__html:product.description}} variant="body2" color="textSecondary" />
			</CardContent>
			
			{/** Add to cart */}
			<CardActions disableSpacing className={classes.cardActions}>
				<IconButton aria-label="Add to Cart" onClick={() => onAddToCart(product.id, 1)}>
					<AddShoppingCart />
				</IconButton>
			</CardActions>
		</Card>
	)
}

export default memo(Product)