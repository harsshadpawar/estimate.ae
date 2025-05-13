import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import React from 'react'

function Add({ addForm, handleAddChange, addErrors }: any) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

            <FormControl fullWidth>
                <InputLabel id="add-title-label">Title</InputLabel>
                <Select
                    labelId="add-title-label"
                    name="title"
                    value={addForm?.title}
                    onChange={handleAddChange}
                >
                    <MenuItem value="Mr.">Mr</MenuItem>
                    <MenuItem value="Mrs.">Mrs</MenuItem>
                    <MenuItem value="Dr.">Dr</MenuItem>
                    <MenuItem value="Prof.">Prof</MenuItem>
                </Select>
                {addErrors?.title && (
                    <Typography variant="caption" color="error">{addErrors.title}</Typography>
                )}
            </FormControl>
            <TextField
                name="first_name"
                label="First Name"
                variant="outlined"
                value={addForm?.first_name}
                onChange={handleAddChange}
                error={Boolean(addErrors?.first_name)}
                fullWidth
            />
            <TextField
                name="last_name"
                label="Last Name"
                variant="outlined"
                value={addForm?.last_name}
                onChange={handleAddChange}
                error={Boolean(addErrors?.last_name)}
                fullWidth
            />
            <TextField
                name="password"
                label="Password"
                variant="outlined"
                value={addForm?.password}
                onChange={handleAddChange}
                error={Boolean(addErrors?.password)}
                fullWidth
            />
            <TextField
                name="email"
                label="Email"
                type="email"
                variant="outlined"
                value={addForm?.email}
                onChange={handleAddChange}
                error={Boolean(addErrors?.email)}
                fullWidth
            />
            <TextField
                name="company_name"
                label="Company"
                variant="outlined"
                value={addForm?.company_name}
                onChange={handleAddChange}
                error={Boolean(addErrors?.company_name)}
                fullWidth
            />
            <FormControl fullWidth>
                <InputLabel id="add-role-label">Role</InputLabel>
                <Select
                    labelId="add-role-label"
                    name="role"
                    value={addForm?.role}
                    onChange={handleAddChange}
                >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="sub-admin">Sub-admin</MenuItem>
                </Select>
                {addErrors?.role && (
                    <Typography variant="caption" color="error">{addErrors?.role}</Typography>
                )}
            </FormControl>
        </Box>
    )
}

export default Add