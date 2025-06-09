// 파일 위치: src/pages/Login.js
// 설명: 사용자 로그인 페이지 컴포넌트
// 기능: 사용자 인증 후 파일 업로드 페이지로 리다이렉트

import React, { useState } from 'react';
import { loginUser } from '../api/userApi';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  Alert 
} from '@mui/material';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const data = await loginUser(username, password);
      // 로그인 성공 후 사용자 정보를 localStorage에 저장
      localStorage.setItem('user', JSON.stringify(data.user));
      // 파일 업로드 페이지로 이동
      navigate('/upload');
    } catch (err) {
      setError(err.detail || '로그인에 실패했습니다.');
    }
  };

  return (

    <>
    {/* 🆕 배경이미지 추가 */}
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw', 
      height: '100vh',
      backgroundImage: 'url(/images/msti-bear.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      opacity: 0.75,
      zIndex: -1,
      pointerEvents: 'none'
    }} />


    <Container maxWidth="sm" sx={{ ml: 'auto', mr: 4 }}>
      <Box sx={{ mt: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            로그인
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="사용자명"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="비밀번호"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              로그인
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
    </>
  );
};

export default Login;