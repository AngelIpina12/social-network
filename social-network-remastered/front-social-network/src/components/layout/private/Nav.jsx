import React from 'react'
import { useSelector } from 'react-redux'
import { AppBar, Avatar, Box, Button, Container, IconButton, Toolbar, Typography } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import avatar from '../../../assets/img/user.png'
import { NavLink } from 'react-router-dom'
import { Global } from '../../../helpers/Global'

export const Nav = () => {
    const auth = useSelector((state) => state.authData.user);

    return (
        <>
            <AppBar position="fixed" color="primary" elevation={1}>
                <Container maxWidth="lg">
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box>

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
                            <Button
                                component={NavLink}
                                to="/social"
                                color="primary"
                                variant="inherit"
                                sx={{ mr: 2 }}
                            >
                                Home
                            </Button>
                            <Button
                                component={NavLink}
                                to="/social/feed"
                                color="primary"
                                variant="inherit"
                                sx={{ mr: 2 }}
                            >
                                Timeline
                            </Button>
                            <Button
                                component={NavLink}
                                to="/social/people"
                                color="primary"
                                variant="inherit"
                                sx={{ mr: 2 }}
                            >
                                People
                            </Button>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <IconButton
                                component={NavLink}
                                to={`/social/profile/${auth?._id}`}
                                sx={{ p: 0 }}
                            >
                                <Avatar
                                    alt="User image"
                                    src={
                                        auth?.image != 'default.jpg'
                                            ? `${Global.url}user/avatar/${auth?.image}`
                                            : avatar
                                    }
                                />
                            </IconButton>
                            <Button
                                component={NavLink}
                                to={`/social/profile/${auth?._id}`}
                                variant="inherit"
                                sx={{ p: 0 }}
                            >
                                {auth?.nick}
                            </Button>
                            <IconButton
                                component={NavLink}
                                to={"/social/config"}
                                sx={{ p: 0 }}
                            >
                                <SettingsIcon />
                            </IconButton>
                            <IconButton
                                component={NavLink}
                                to={"/social/logout"}
                                sx={{ p: 0 }}
                            >
                                <LogoutIcon />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Toolbar />
        </>
    )
}


