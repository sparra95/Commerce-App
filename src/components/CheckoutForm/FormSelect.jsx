import React from 'react'
import { InputLabel, Select, MenuItem, Grid } from "@material-ui/core"

const FormSelect = ({ label, selectOptions, setValue, currentValue }) => {
    return (
        <Grid item xs={12} sm={6}>
            <InputLabel>{label}</InputLabel>
            <Select value={currentValue} fullWidth onChange={(e) => setValue(e.target.value)}>
                {selectOptions.map((item) => (
                    <MenuItem key={item.id } value={item.id}>{item.label}</MenuItem>
                ))}
            </Select>
        </Grid>
    )
}

export default FormSelect