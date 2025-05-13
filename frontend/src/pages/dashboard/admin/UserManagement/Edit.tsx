import React from 'react'
import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
function Edit({handleEditChange,disabled,editForm,errors}:any) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="role-label">Title</InputLabel>
            <Select
              labelId="role-label"
              name="title"
              value={editForm?.title}
              label="totle"
              onChange={handleEditChange}
              disabled={disabled}
            >
              <MenuItem value="Mr.">Mr</MenuItem>
              <MenuItem value="Mrs.">Mrs</MenuItem>
              <MenuItem value="Dr.">Dr</MenuItem>
              <MenuItem value="Prof.">Prof</MenuItem>
            </Select>
            {errors?.title && (
              <Typography variant="caption" color="error">{errors?.title}</Typography>
            )}
          </FormControl>
          <TextField
            name="first_name"
            label="First Name"
            variant="outlined"
            value={editForm?.first_name}
            onChange={handleEditChange}
            error={Boolean(errors?.first_name)}
            disabled={disabled}
            fullWidth
          />
          <TextField
            name="last_name"
            label="Last Name"
            variant="outlined"
            value={editForm?.last_name}
            onChange={handleEditChange}
            error={Boolean(errors?.last_name)}
            disabled={disabled}
            fullWidth
          />
          <TextField
            name="email"
            label="Email"
            type="email"
            variant="outlined"
            value={editForm.email}
            onChange={handleEditChange}
            error={Boolean(errors?.email)}
            disabled={disabled}
            fullWidth
          />
          <TextField
            name="company_name"
            label="Company"
            variant="outlined"
            value={editForm?.company_name}
            onChange={handleEditChange}
            error={Boolean(errors?.company_name)}
            disabled={disabled}
            fullWidth
          />


          <FormControl fullWidth>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              name="role"
              value={editForm?.role}
              label="Role"
              disabled={disabled}
              onChange={handleEditChange}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="sub-admin">Sub-admin</MenuItem>
            </Select>
            {errors?.role && (
              <Typography variant="caption" color="error">{errors?.role}</Typography>
            )}
          </FormControl>

        </Box>
  )
}

export default Edit