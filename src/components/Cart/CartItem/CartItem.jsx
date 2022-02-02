import React from "react"
import { Typography, Button, Card, CardActions, CardContent, CardMedia } from "@material-ui/core"
import useStyles from "./styles"

const CartItem = ({ name, id, url, price, quantity, onUpdateCartQuantity, onRemoveFromCart }) => {
	const classes = useStyles()

	return (
		<Card>
			{/** Image */}
			<CardMedia image={url} alt={name} className={classes.media} />

			{/** Name and price */}
			<CardContent className={classes.cardContent}>
				<Typography variant="h4">{name}</Typography>
				<Typography variant="h5">{price}</Typography>
			</CardContent>
			
			<CardActions className={classes.cardActions}>

				{/** Add/subtract item quantity */}
				<div className={classes.buttons}>
					<Button type="button" size="small" onClick={() => onUpdateCartQuantity(id, quantity - 1)}>-</Button>
					<Typography>{quantity}</Typography>
					<Button type="button" size="small" onClick={() => onUpdateCartQuantity(id, quantity + 1)}>+</Button>
				</div>

				{/** Remove item */}
				<Button variant="contained" type="button" color="secondary" onClick={() => onRemoveFromCart(id)}>Remove</Button>
			</CardActions>

		</Card>
	)
}

export default CartItem