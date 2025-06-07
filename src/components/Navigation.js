// src/components/Navigation.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Navigation = () => {
  return (
    <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: '1px solid #ddd' }}>
      <Toolbar>
        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          소비 패턴 분석
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/character">
            내 캐릭터
          </Button>

          <Button color="inherit" component={RouterLink} to="/dashboard">
            대시보드
          </Button>

          <Button color="inherit" component={RouterLink} to="/comparison">
            소비 비교
          </Button>
          
          <Button color="inherit" component={RouterLink} to="/integrated">
            통합 분석
          </Button>
          

          <Button 
            color="inherit" 
            onClick={() => {
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
          >
            로그아웃
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;