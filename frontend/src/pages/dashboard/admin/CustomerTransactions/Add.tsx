import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import React from 'react'

function Add({ addForm, handleAddChange, addErrors, user }: any) {
    console.log("user", user)
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

            <FormControl fullWidth>
                <InputLabel id="add-title-label">User</InputLabel>
                <Select
                    labelId="add-title-label"
                    name="user"
                    value={addForm?.user}
                    onChange={handleAddChange}
                >
                    {user.map((u: any) => (
                        <MenuItem key={u.id} value={u.id}>
                            {u.first_name} {u.last_name}
                        </MenuItem>
                    ))}
                </Select>
                {addErrors?.user && (
                    <Typography variant="caption" color="error">
                        {addErrors.user}
                    </Typography>
                )}
            </FormControl>

            <FormControl fullWidth>
                <InputLabel id="add-title-label">currency</InputLabel>
                <Select
                    labelId="add-title-label"
                    name="currency"
                    value={addForm?.currency}
                    onChange={handleAddChange}
                >
                    <MenuItem value="USD">usd</MenuItem>
                    <MenuItem value="INR">Inr</MenuItem>
                </Select>
                {addErrors?.currency && (
                    <Typography variant="caption" color="error">{addErrors.currency}</Typography>
                )}
            </FormControl>
            <TextField
                name="amount"
                label="Amount"
                variant="outlined"
                value={addForm?.amount}
                onChange={handleAddChange}
                error={Boolean(addErrors?.amount)}
                fullWidth
            />
            <TextField
                name="reference_number"
                label="reference_number"
                variant="outlined"
                value={addForm?.reference_number}
                onChange={handleAddChange}
                error={Boolean(addErrors?.reference_number)}
                fullWidth
            />
            <FormControl fullWidth>
                <InputLabel id="add-title-label">Status</InputLabel>
                <Select
                    labelId="add-title-label"
                    name="status"
                    value={addForm?.currency}
                    onChange={handleAddChange}
                >
                    <MenuItem value="PENDING">PENDING</MenuItem>
                    <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                    <MenuItem value="FAILED">FAILED</MenuItem>
                    <MenuItem value="REFUNDED">REFUNDED</MenuItem>
                </Select>
                {addErrors?.status && (
                    <Typography variant="caption" color="error">{addErrors.status}</Typography>
                )}
            </FormControl>
            <FormControl fullWidth>
                <InputLabel id="add-title-label">transaction_type</InputLabel>
                <Select
                    labelId="add-title-label"
                    name="transaction_type"
                    value={addForm?.transaction_type}
                    onChange={handleAddChange}
                >
                    <MenuItem value="credit">credit</MenuItem>
                    <MenuItem value="debit">debit</MenuItem>
                    <MenuItem value="refund">refund</MenuItem>
                    <MenuItem value="purchase">purchase</MenuItem>
                </Select>
                {addErrors?.transaction_type && (
                    <Typography variant="caption" color="error">{addErrors.transaction_type}</Typography>
                )}
            </FormControl>
            <FormControl fullWidth>
                <InputLabel id="add-title-label">payment method</InputLabel>
                <Select
                    labelId="add-title-label"
                    name="payment_method"
                    value={addForm?.payment_method}
                    onChange={handleAddChange}
                >
                    <MenuItem value="card">card</MenuItem>
                    <MenuItem value="cash">cash</MenuItem>
                    <MenuItem value="upi">upi</MenuItem>
                </Select>
                {addErrors?.payment_method && (
                    <Typography variant="caption" color="error">{addErrors.payment_method}</Typography>
                )}
            </FormControl>
        </Box>
    )
}

export default Add