import React from 'react'
import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
function Edit({ handleEditChange, disabled, editForm, errors }: any) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        name="user"
        label="User"
        variant="outlined"
        value={editForm?.user?.first_name}
        // onChange={handleEditChange}
        disabled={true}
        // error={Boolean(errors?.amount)}
        fullWidth
      />
      <FormControl fullWidth>
        <InputLabel id="add-title-label">currency</InputLabel>
        <Select
          labelId="add-title-label"
          name="currency"
          value={editForm?.currency}
          onChange={handleEditChange}
          disabled={disabled}
        >
          <MenuItem value="USD">usd</MenuItem>
          <MenuItem value="INR">Inr</MenuItem>
        </Select>
        {errors?.currency && (
          <Typography variant="caption" color="error">{errors.currency}</Typography>
        )}
      </FormControl>
      <TextField
        name="amount"
        label="Amount"
        variant="outlined"
        value={editForm?.amount}
        onChange={handleEditChange}
        disabled={disabled}
        error={Boolean(errors?.amount)}
        fullWidth
      />
      <TextField
        name="reference_number"
        label="reference_number"
        variant="outlined"
        value={editForm?.reference_number}
        disabled={disabled}
        onChange={handleEditChange}
        error={Boolean(errors?.reference_number)}
        fullWidth
      />
      <FormControl fullWidth>
        <InputLabel id="add-title-label">Status</InputLabel>
        <Select
          labelId="add-title-label"
          name="status"
          value={editForm?.status}
          onChange={handleEditChange}
          disabled={disabled}
        >
          <MenuItem value="pending">PENDING</MenuItem>
          <MenuItem value="completed">COMPLETED</MenuItem>
          <MenuItem value="failed">FAILED</MenuItem>
          <MenuItem value="refunded">REFUNDED</MenuItem>
        </Select>
        {errors?.status && (
          <Typography variant="caption" color="error">{errors.status}</Typography>
        )}
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="add-title-label">transaction_type</InputLabel>
        <Select
          labelId="add-title-label"
          name="transaction_type"
          value={editForm?.transaction_type}
          onChange={handleEditChange}
          disabled={disabled}
        >
          <MenuItem value="credit">credit</MenuItem>
          <MenuItem value="debit">debit</MenuItem>
          <MenuItem value="refund">refund</MenuItem>
          <MenuItem value="purchase">purchase</MenuItem>
        </Select>
        {errors?.transaction_type && (
          <Typography variant="caption" color="error">{errors.transaction_type}</Typography>
        )}
      </FormControl>
    </Box>
  )
}

export default Edit