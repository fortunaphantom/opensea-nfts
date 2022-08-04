import React, { useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { connectWallet, disconnectWallet } from 'actions/web3';
import api from 'utils/api';

const pages = [
  {
    title: 'Create Collections',
    href: '/create'
  },
];

interface IHeader {}

const Header = (props: IHeader) => {
  const dispatch = useDispatch() as any;
  const selectedAddress = useSelector<any, string>(state => state.web3.selectedAddress);

  useEffect(() => {
    api.defaults.headers.common["wallet"] = selectedAddress;
  }, [selectedAddress]);

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const onConnect = () => {
    if (selectedAddress) {
      dispatch(disconnectWallet());
    } else {
      dispatch(connectWallet());
    }
  };

  return (
    <HeaderComponent>
      <AppBar position='static'>
        <Container maxWidth='xl'>
          <Toolbar disableGutters>
            <Typography
              variant='h6'
              noWrap
              component='div'
              sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
            >
              <Link to="/">NFT Launchpad Demo</Link>
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size='large'
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleOpenNavMenu}
                color='inherit'
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id='menu-appbar'
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page.href} onClick={handleCloseNavMenu}>
                    <Typography textAlign='center'>{page.title}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Typography
              variant='h6'
              noWrap
              component='div'
              sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
            >
              NFT Launchpad Demo
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page.href}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  <Link to={page.href}>{page.title}</Link>
                </Button>
              ))}
            </Box>

            <Box>
              <Button className='connect' onClick={onConnect}>
                {selectedAddress ? "Connected " + selectedAddress : "Connect"}
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HeaderComponent>
  );
};

export default Header;

const HeaderComponent = styled.div`
  a {
    text-decoration: none;
    color: #fff;
  }

  .connect {
    color: #fff;
  }
`;
