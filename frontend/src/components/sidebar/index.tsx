import React from 'react';
import { Drawer, List, ListItem, ListItemText, Avatar, Typography } from '@mui/material';
import { ListItemIcon } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';

const Sidebar = () => {
    return (
        <Drawer
            variant="permanent"
            anchor="left"
            sx={{
                width: 240,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
            }}
        >
            <div style={{ padding: '16px' }}>
                <Typography variant="h6">Logo Text</Typography>
            </div>
            <List>
                <ListItem button>
                    <ListItemIcon><FolderIcon /></ListItemIcon>
                    <ListItemText primary="Calculate Models Estimation" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon><SettingsIcon /></ListItemIcon>
                    <ListItemText primary="User Level Configuration Settings" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon><PersonIcon /></ListItemIcon>
                    <ListItemText primary="User Account Page Configurations" />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default Sidebar;
