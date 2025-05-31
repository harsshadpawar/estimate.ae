import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import React from 'react'

function Add({ addForm, handleAddChange, addErrors }: any) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
                name="first_name"
                label="First Name"
                variant="outlined"
                value={addForm?.first_name || ''}
                onChange={handleAddChange}
                error={Boolean(addErrors?.first_name)}
                helperText={addErrors?.first_name}
                fullWidth
                required
            />
            <TextField
                name="last_name"
                label="Last Name"
                variant="outlined"
                value={addForm?.last_name || ''}
                onChange={handleAddChange}
                error={Boolean(addErrors?.last_name)}
                helperText={addErrors?.last_name}
                fullWidth
                required
            />
            <TextField
                name="email"
                label="Email"
                type="email"
                variant="outlined"
                value={addForm?.email || ''}
                onChange={handleAddChange}
                error={Boolean(addErrors?.email)}
                helperText={addErrors?.email}
                fullWidth
                required
            />
            <TextField
                name="phone"
                label="Phone"
                variant="outlined"
                value={addForm?.phone || ''}
                onChange={handleAddChange}
                error={Boolean(addErrors?.phone)}
                helperText={addErrors?.phone}
                fullWidth
            />
            <FormControl fullWidth>
                <InputLabel id="add-gender-label">Gender</InputLabel>
                <Select
                    labelId="add-gender-label"
                    name="gender"
                    value={addForm?.gender || ''}
                    label="Gender"
                    onChange={handleAddChange}
                    error={Boolean(addErrors?.gender)}
                >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                </Select>
                {addErrors?.gender && (
                    <Typography variant="caption" color="error">{addErrors.gender}</Typography>
                )}
            </FormControl>
            <TextField
                name="date_of_birth"
                label="Date of Birth"
                type="date"
                variant="outlined"
                value={addForm?.date_of_birth || ''}
                onChange={handleAddChange}
                error={Boolean(addErrors?.date_of_birth)}
                helperText={addErrors?.date_of_birth}
                InputLabelProps={{
                    shrink: true,
                }}
                fullWidth
            />
            <TextField
                name="address"
                label="Address"
                variant="outlined"
                multiline
                rows={3}
                value={addForm?.address || ''}
                onChange={handleAddChange}
                error={Boolean(addErrors?.address)}
                helperText={addErrors?.address}
                fullWidth
            />
            <FormControl fullWidth>
                <InputLabel id="add-subscription-label">Subscription Plan</InputLabel>
                <Select
                    labelId="add-subscription-label"
                    name="subscription_plan"
                    value={addForm?.subscription_plan || 'free'}
                    label="Subscription Plan"
                    onChange={handleAddChange}
                    error={Boolean(addErrors?.subscription_plan)}
                >
                    <MenuItem value="free">Free</MenuItem>
                    <MenuItem value="basic">Basic</MenuItem>
                    <MenuItem value="premium">Premium</MenuItem>
                    <MenuItem value="enterprise">Enterprise</MenuItem>
                </Select>
                {addErrors?.subscription_plan && (
                    <Typography variant="caption" color="error">{addErrors.subscription_plan}</Typography>
                )}
            </FormControl>
            <FormControl fullWidth>
                <InputLabel id="add-role-label">Role</InputLabel>
                <Select
                    labelId="add-role-label"
                    name="role_name"
                    value={addForm?.role_name || 'user'}
                    label="Role"
                    onChange={handleAddChange}
                    error={Boolean(addErrors?.role_name)}
                >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="super-admin">Super Admin</MenuItem>
                </Select>
                {addErrors?.role_name && (
                    <Typography variant="caption" color="error">{addErrors.role_name}</Typography>
                )}
            </FormControl>
            <TextField
                name="password"
                label="Password"
                type="password"
                variant="outlined"
                value={addForm?.password || ''}
                onChange={handleAddChange}
                error={Boolean(addErrors?.password)}
                helperText={addErrors?.password || "Password is required for new users"}
                fullWidth
                required
            />
        </Box>
    )
}

export default Add