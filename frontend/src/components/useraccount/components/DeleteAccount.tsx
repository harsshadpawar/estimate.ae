"use client"

import {
    Box,
    Button,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
} from "@mui/material"
import { FileWarningIcon as Warning, X } from 'lucide-react'
import { useState } from "react"
import { useUserContext } from "../../../context/UserContext"
import apiClient from "../../../services/interceptor"
import deleteimg from '../../../assets/images/delete.png';
export function DeleteAccount() {
    const { user } = useUserContext()
    const [open, setOpen] = useState(false)

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const handleDelete = async () => {
        try {
            const payload = {
                email: user?.email,
            };
    
            // Set the Content-Type header to application/json
            const response = await apiClient.delete("/api/auth/delete", {
                data: payload,  // Ensure the payload is sent as the request body
                headers: {
                    "Content-Type": "application/json",
                },
            });
            handleClose();
        } catch (error) {
            console.error("Error deleting account:", error);
        }
    };
    

    return (
        <>
            <Box
                sx={{
                    bgcolor: "error.lighter",
                    p: 3,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                }}
            >
                <Button
                    color="error"
                    variant="contained"
                    startIcon={<X className="h-4 w-4" />}
                    sx={{ borderRadius: 28 }}
                    onClick={handleOpen}
                >
                    Delete Account
                </Button>
                <Typography variant="body2" color="error.main">
                    If you delete your account now, you will have the option to recover it within 30 days.
                </Typography>
            </Box>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        width: '100%',
                        maxWidth: '400px',
                    }
                }}
            >
                <DialogTitle sx={{
                    textAlign: 'center',
                    pb: 0,
                    pt: 2
                }}>
                    <IconButton
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                        }}
                    >
                        <X />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    px: 4,
                    pb: 3
                }}>
                    <img src={deleteimg} alt="404" />
                    <Typography align="center" sx={{ mb: 2 }}>
                        Your request is under process with Request ID XXXXXX and our representative will be in touch with you for the same.
                    </Typography>
                </DialogContent>

                <DialogActions sx={{
                    justifyContent: 'center',
                    pb: 3,
                    px: 3,
                    gap: 2
                }}>
                    <Button
                        onClick={handleClose}
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            px: 4
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        variant="contained"
                        color="error"
                        sx={{
                            borderRadius: 2,
                            px: 4
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

