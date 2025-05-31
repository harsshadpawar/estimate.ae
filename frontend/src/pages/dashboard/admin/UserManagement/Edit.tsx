import React from 'react'
import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Chip } from '@mui/material'

function Edit({ handleEditChange, disabled, editForm, errors }: any) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
                name="first_name"
                label="First Name"
                variant="outlined"
                value={editForm?.first_name || ''}
                onChange={handleEditChange}
                error={Boolean(errors?.first_name)}
                helperText={errors?.first_name}
                disabled={disabled}
                fullWidth
            />
            <TextField
                name="last_name"
                label="Last Name"
                variant="outlined"
                value={editForm?.last_name || ''}
                onChange={handleEditChange}
                error={Boolean(errors?.last_name)}
                helperText={errors?.last_name}
                disabled={disabled}
                fullWidth
            />
            <TextField
                name="email"
                label="Email"
                type="email"
                variant="outlined"
                value={editForm?.email || ''}
                onChange={handleEditChange}
                error={Boolean(errors?.email)}
                helperText={errors?.email}
                disabled={disabled}
                fullWidth
            />
            <TextField
                name="phone"
                label="Phone"
                variant="outlined"
                value={editForm?.phone || ''}
                onChange={handleEditChange}
                error={Boolean(errors?.phone)}
                helperText={errors?.phone}
                disabled={disabled}
                fullWidth
            />
            <FormControl fullWidth>
                <InputLabel id="edit-gender-label">Gender</InputLabel>
                <Select
                    labelId="edit-gender-label"
                    name="gender"
                    value={editForm?.gender || ''}
                    label="Gender"
                    onChange={handleEditChange}
                    error={Boolean(errors?.gender)}
                    disabled={disabled}
                >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                </Select>
                {errors?.gender && (
                    <Typography variant="caption" color="error">{errors.gender}</Typography>
                )}
            </FormControl>
            <TextField
                name="date_of_birth"
                label="Date of Birth"
                type="date"
                variant="outlined"
                value={editForm?.date_of_birth ? editForm.date_of_birth.split('T')[0] : ''}
                onChange={handleEditChange}
                error={Boolean(errors?.date_of_birth)}
                helperText={errors?.date_of_birth}
                InputLabelProps={{
                    shrink: true,
                }}
                disabled={disabled}
                fullWidth
            />
            <TextField
                name="address"
                label="Address"
                variant="outlined"
                multiline
                rows={3}
                value={editForm?.address || ''}
                onChange={handleEditChange}
                error={Boolean(errors?.address)}
                helperText={errors?.address}
                disabled={disabled}
                fullWidth
            />
            <FormControl fullWidth>
                <InputLabel id="edit-subscription-label">Subscription Plan</InputLabel>
                <Select
                    labelId="edit-subscription-label"
                    name="subscription_plan"
                    value={editForm?.subscription_plan || 'free'}
                    label="Subscription Plan"
                    onChange={handleEditChange}
                    error={Boolean(errors?.subscription_plan)}
                    disabled={disabled}
                >
                    <MenuItem value="free">Free</MenuItem>
                    <MenuItem value="basic">Basic</MenuItem>
                    <MenuItem value="premium">Premium</MenuItem>
                    <MenuItem value="enterprise">Enterprise</MenuItem>
                </Select>
                {errors?.subscription_plan && (
                    <Typography variant="caption" color="error">{errors.subscription_plan}</Typography>
                )}
            </FormControl>
            <FormControl fullWidth>
                <InputLabel id="edit-role-label">Role</InputLabel>
                <Select
                    labelId="edit-role-label"
                    name="role_name"
                    value={editForm?.role_name || 'user'}
                    label="Role"
                    onChange={handleEditChange}
                    error={Boolean(errors?.role_name)}
                    disabled={disabled}
                >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="super-admin">Super Admin</MenuItem>
                </Select>
                {errors?.role_name && (
                    <Typography variant="caption" color="error">{errors.role_name}</Typography>
                )}
            </FormControl>
            
            {/* Status Information (Read-only) */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                    Account Status
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip 
                        label={editForm?.is_active ? "Active" : "Inactive"} 
                        color={editForm?.is_active ? "success" : "default"}
                        size="small"
                    />
                    <Chip 
                        label={editForm?.email_verified ? "Email Verified" : "Email Not Verified"} 
                        color={editForm?.email_verified ? "info" : "warning"}
                        size="small"
                    />
                </Box>
                {editForm?.last_login_at && (
                    <Typography variant="caption" color="text.secondary">
                        Last Login: {new Date(editForm.last_login_at).toLocaleDateString()}
                    </Typography>
                )}
            </Box>
        </Box>
    )
}

export default Edit