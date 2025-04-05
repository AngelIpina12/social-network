import React from 'react'
import { NavLink } from 'react-router-dom'
import { AppBar, Box, Button, Container, IconButton, Toolbar, Typography } from '@mui/material'
import LoginIcon from '@mui/icons-material/Login';
import BorderColorIcon from '@mui/icons-material/BorderColor';

export const Nav = () => {
    return (
        <AppBar position="static" color="primary" elevation={1}>
            <Container maxWidth="lg">
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        component={NavLink}
                        to="/social"
                        color="primary"
                        variant="inherit"
                    >
                        <Typography variant="h6" component="div" sx={{ display: 'inline-block', mr: 4 }}>
                            Social Network
                        </Typography>
                    </Button>

                    <Box>
                        <IconButton
                            component={NavLink}
                            to={"/login"}
                            sx={{ p: 0 }}
                        >
                            <LoginIcon />
                        </IconButton>
                        <Button
                            component={NavLink}
                            to="/login"
                            color="default"
                            variant="inherit"
                            sx={{ mr: 2 }}
                        >
                            Login
                        </Button>
                        <IconButton
                            component={NavLink}
                            to={"/register"}
                            sx={{ p: 0 }}
                        >
                            <BorderColorIcon />
                        </IconButton>
                        <Button
                            component={NavLink}
                            to="/register"
                            color="default"
                            variant="inherit"
                        >
                            Register
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}
