// import React from 'react';
// import {
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     Button,
//     IconButton,
// } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';

// interface ModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     title: string;
//     children: React.ReactNode;
//     actions?: React.ReactNode;
//     width?:string
// }

// export const Modal: React.FC<ModalProps> = ({
//     isOpen,
//     onClose,
//     title,
//     children,
//     actions,
//     width = 'lg',
// }) => {
//     return (
//         <Dialog
//             open={isOpen}
//             onClose={onClose}
//             aria-labelledby="custom-modal-title"
//             maxWidth={width}
//             fullWidth
//             PaperProps={{
//                 sx: {
//                     borderRadius: '12px',
//                     overflow: 'hidden'
//                 }
//             }}
//         >
//             <DialogTitle 
//                 id="custom-modal-title" 
//                 sx={{ 
//                     m: 0, 
//                     // p: 2,
//                     background: '#CAE8FF',
//                     color: '#2c2c2c',
//                     fontSize: '18px',
//                     fontWeight: 600,
//                     lineHeight:'24px'
//                 }}
//             >
//                 {title}
//                 <IconButton
//                     aria-label="close"
//                     onClick={onClose}
//                     sx={{
//                         position: 'absolute',
//                         right: 8,
//                         top: 8,
//                         color: '#666666',
//                         '&:hover': {
//                             color: '#333333'
//                         }
//                     }}
//                 >
//                     <CloseIcon />
//                 </IconButton>
//             </DialogTitle>
//             <DialogContent dividers>{children}</DialogContent>
//             {actions && <DialogActions>{actions}</DialogActions>}
//         </Dialog>
//     );
// };



import React from 'react';
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import logo from '../../assets/images/Logoo.png';
interface OffCanvasProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
    width?: string; // Width of the drawer
}

export const Modal: React.FC<OffCanvasProps> = ({
    isOpen,
    onClose,
    title,
    children,
    actions,
    width = '40%', // Default width for the drawer
}) => {
    return (
        <Drawer
            anchor="right" // Drawer slides in from the right
            open={isOpen}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: width,
                    borderRadius: '12px 0 0 12px',
                    overflow: 'hidden',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                },
            }}
        >
            {/* Header */}
            <Box sx={{ position: 'relative' }}>
                {/* Logo just outside the left of the header */}
                <Box
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        cursor: 'pointer',
                        position: 'fixed',
                         top: '3%',
                        left: width == '40%' ? '56.5%' : '36.5%',
                        // transform: 'translateY(-50%)',
                        background: '#fff',
                        borderBottomLeftRadius: '20px',
                        borderTopLeftRadius: '20px',
                        width: '55px',
                        height: '40px',
                        border: '1px solid #ddd',
                        boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <img
                        src={logo}
                        alt="Logo"
                        style={{
                            width: '24px',
                            height: '24px',
                        }}
                    />
                </Box>

                {/* Header */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        background: '#CAE8FF',
                        color: '#2c2c2c',
                        padding: '16px 16px 16px 32px',
                        borderBottom: '1px solid #ddd',
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontSize: '18px',
                            fontWeight: 600,
                            lineHeight: '24px',
                        }}
                    >
                        {title}
                    </Typography>
                </Box>
            </Box>


            {/* Content */}
            <Box
                sx={{
                    padding: '16px',
                    flex: 1,
                    overflowY: 'auto',
                }}
            >
                {children}
            </Box>

            {/* Footer Actions */}
            {actions && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '8px',
                        padding: '16px',
                        borderTop: '1px solid #ddd',
                    }}
                >
                    {actions}
                </Box>
            )}
        </Drawer>
    );
};
