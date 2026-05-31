import React from 'react';
import { Box, Container, Link, TextField, Button } from '@mui/material';

const Footer = () => {
    return (
        <Box 
            component="footer" 
            sx={{ 
                bgcolor: '#000000', // Deep black theme 
                color: '#ffffff', 
                py: 1.5, // Tiny vertical footprint
                borderTop: '1px solid #111111',
                fontFamily: 'Roboto, sans-serif'
            }}
        >
            <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                
                {/* Ultra-Small Minimalist Links */}
                <Box sx={{ display: 'flex', gap: { xs: 2, sm: 4 }, justifyContent: 'center' }}>
                    {['Services', 'Company', 'Legal', 'Privacy'].map((text) => (
                        <Link 
                            key={text} 
                            href="#" 
                            underline="none" 
                            sx={microTextStyles}
                        >
                            {text}
                        </Link>
                    ))}
                </Box>

                {/* Flat Inline Form (Zero Box Structure) */}
                <Box component="form" sx={{ display: 'flex', alignItems: 'center', maxWidth: '240px' }}>
                    <TextField 
                        variant="standard" 
                        placeholder="Email updates" 
                        slotProps={{
                            htmlInput: {
                                style: { 
                                    color: '#ffffff', 
                                    fontSize: '0.8rem',
                                    padding: '2px 0'
                                }
                            }
                        }}
                        sx={{
                            flexGrow: 1,
                            // Completely deletes default text field underline aesthetics
                            '& .MuiInput-underline:before': { borderBottom: 'none !important' },
                            '& .MuiInput-underline:after': { borderBottom: 'none' },
                            '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                        }}
                    />
                    
                    <Button 
                        variant="text" 
                        type="submit"
                        sx={{
                            ...microTextStyles,
                            minWidth: 'auto',
                            padding: 0,
                            ml: 2,
                            fontWeight: 'bold',
                            textTransform: 'none',
                            '&:hover': {
                                bgcolor: 'transparent',
                                color: '#ffffff'
                            }
                        }}
                    >
                        Join
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

// Low-profile micro text style configuration
const microTextStyles = {
    fontSize: '0.8rem', // Extra small text
    fontWeight: 500,
    color: '#666666', // Muted clean gray by default
    transition: 'color 0.25s ease-in-out',
    
    '&:hover': { 
        color: '#ffffff', // Crisp white fade animation on hover
    }
};

export default Footer;