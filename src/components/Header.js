import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function Header() {
    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h4">
                        Video Summary Generator
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
export default Header;