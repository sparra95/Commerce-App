import React from "react"
import { TextField, Grid } from "@material-ui/core"
import { useFormContext, Controller } from "react-hook-form"

const FormInput = ({ name, label }) => {
	const { control } = useFormContext()
	
	return (
		<Grid item xs={12} sm={6}>
			<Controller
				control={control}
				name={name}
				defaultValue=""
				render={({field: { onChange, value }}) =>
					<TextField fullWidth required name={name} label={label} onChange={onChange} value={value} />
				}
			/>
		</Grid>
	)
}

export default FormInput