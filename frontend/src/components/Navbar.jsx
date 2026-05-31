import React, { useState } from 'react';
import styled from 'styled-components';
import LogoImg from '../utils/Images/Logo1.png';
import { Link as LinkR, NavLink } from 'react-router-dom';
import { MenuRounded } from '@mui/icons-material';
import { Avatar, Button, Menu, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/reducers/userSlice';

const Nav = styled.div`
  background-color: #000000;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid #1c1c1f;
  backdrop-filter: blur(8px);
`;

const NavContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 0 24px;
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
`;

const NavLogo = styled(LinkR)`
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 800;
  font-size: 22px;
  text-decoration: none;
  letter-spacing: -0.025em;
  background: linear-gradient(to right, #34d399, #14b8a6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.85;
  }
`;

const Logo = styled.img`
  height: 42px;
  filter: brightness(1.1);
`;

const Mobileicon = styled.div`
  color: #f4f4f5;
  display: none;
  cursor: pointer;
  transition: color 0.2s;
  &:hover {
    color: #10b981;
  }
  @media screen and (max-width: 768px) {
    display: flex;
    align-items: center;
  }
`;

const NavItems = styled.ul`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 28px;
  padding: 0;
  margin: 0;
  list-style: none;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  color: #a1a1aa;
  font-weight: 600;
  font-size: 0.925rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  letter-spacing: 0.01em;

  &:hover {
    color: #10b981;
  }
  
  &.active {
    color: #10b981;
  }
`;

const ExternalLink = styled.a`
  display: flex;
  align-items: center;
  color: #a1a1aa;
  font-weight: 600;
  font-size: 0.925rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  letter-spacing: 0.01em;

  &:hover {
    color: #10b981;
  }
`;

const UserContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  align-items: center;
  padding: 0;
`;

const MobileMenu = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 20px;
  list-style: none;
  width: 100%;
  padding: 24px 32px 32px 32px;
  background: #09090b;
  border-bottom: 1px solid #1c1c1f;
  position: absolute;
  top: 80px;
  right: 0;
  transition: all 0.3s ease-in-out;
  transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(-100%)')};
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
  z-index: ${({ isOpen }) => (isOpen ? '1000' : '-1000')};
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);

  @media screen and (min-width: 769px) {
    display: none;
  }
`;

const SimpleMenuItem = styled(MenuItem)`
  color: #f4f4f5 !important;
  font-weight: 500 !important;
  font-size: 0.875rem !important;
  background-color: transparent !important;
  transition: background-color 0.2s ease !important;
  
  &:hover {
    background-color: #18181b !important;
    color: #10b981 !important;
  }
`;

const StyledAvatar = styled(Avatar)`
  background-color: #09090b !important;
  border: 1px solid #27272a !important;
  color: #10b981 !important;
  font-weight: bold !important;
  transition: all 0.2s ease;

  &:hover {
    border-color: #10b981 !important;
    box-shadow: 0 0 10px rgba(16, 185, 129, 0.2);
  }
`;

const Navbar = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
  };

  return (
    <Nav>
      <NavContainer>
        <NavLogo to="/">
          <Logo src={LogoImg} alt="Logo" />
          Chiranjivi
        </NavLogo>
        
        <Mobileicon onClick={() => setIsOpen(!isOpen)}>
          <MenuRounded sx={{ fontSize: '28px' }} />
        </Mobileicon>

        {/* Mobile Navigation Panel */}
        <MobileMenu isOpen={isOpen}>
          <StyledNavLink to="/" onClick={() => setIsOpen(false)}>Home</StyledNavLink>
          <StyledNavLink to="/symptomcheck" onClick={() => setIsOpen(false)}>Symptom Check</StyledNavLink>
          <StyledNavLink to="/labreport" onClick={() => setIsOpen(false)}>Lab Report</StyledNavLink>
          <StyledNavLink to="/chat" onClick={() => setIsOpen(false)}>Chat</StyledNavLink>
        </MobileMenu>
        
        {/* Desktop Navigation Links */}
        <NavItems>
          <StyledNavLink to="/">Home</StyledNavLink>
          <StyledNavLink to="/symptomcheck">Symptom Check</StyledNavLink>
          <StyledNavLink to="/labreport">Lab Report</StyledNavLink>
          <StyledNavLink to="/chat">Chat</StyledNavLink>
        </NavItems>

        {/* User Menu Actions */}
        <UserContainer>
          <Button onClick={handleClick} sx={{ minWidth: 'auto', p: 0, borderRadius: '50%' }}>
            <StyledAvatar src={currentUser?.img}>
              {currentUser?.name ? currentUser.name[0] : ''}
            </StyledAvatar>
          </Button>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                bgcolor: '#09090b',
                border: '1px solid #1c1c1f',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)',
                borderRadius: '12px',
                mt: '10px',
                minWidth: '160px',
                '& .MuiList-root': {
                  padding: '4px 0',
                },
              },
            }}
          >
            <SimpleMenuItem onClick={handleClose}>
              <StyledNavLink to="/profile" style={{ width: '100%', color: 'inherit' }}>My Profile</StyledNavLink>
            </SimpleMenuItem>
            <SimpleMenuItem onClick={handleClose}>
              <StyledNavLink to="/finddoctor" style={{ width: '100%', color: 'inherit' }}>Find Doctor</StyledNavLink>
            </SimpleMenuItem>
            <SimpleMenuItem onClick={handleClose}>
              <StyledNavLink to="/dietplan" style={{ width: '100%', color: 'inherit' }}>Diet Plan</StyledNavLink>
            </SimpleMenuItem>
            {currentUser?.role === 'admin' && (
              <SimpleMenuItem onClick={handleClose}>
                <StyledNavLink to="/admin" style={{ width: '100%', color: 'inherit' }}>Admin Panel</StyledNavLink>
              </SimpleMenuItem>
            )}
            <SimpleMenuItem onClick={handleLogout} sx={{ color: '#ef4444 !important' }}>
              Logout
            </SimpleMenuItem>
          </Menu>
        </UserContainer>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;