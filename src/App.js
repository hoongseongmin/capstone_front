// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// 페이지 컴포넌트 import
import Login from './pages/Login';
import FileUpload from './pages/FileUpload';
import Dashboard from './pages/Dashboard';
import Comparison from './pages/Comparison'; // 새로 추가된 비교 페이지
// 다른 페이지들을 여기에 import

// 테마 설정
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// 인증 상태 확인 함수
const isAuthenticated = () => {
  const user = localStorage.getItem('user');
  return !!user; // user가 존재하면 true, 없으면 false 반환
};

// 인증이 필요한 Route 컴포넌트
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // 인증되지 않은 경우 로그인 페이지로 리다이렉트
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* 공개 라우트 */}
          <Route path="/login" element={<Login />} />
          
          {/* 로그인이 필요한 라우트들 */}
          <Route path="/upload" element={
            <ProtectedRoute>
              <FileUpload />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/comparison" element={
            <ProtectedRoute>
              <Comparison />
            </ProtectedRoute>
          } />
          
          {/* 루트 경로 처리 */}
          <Route path="/" element={
            isAuthenticated() ? 
              <Navigate to="/upload" replace /> : 
              <Navigate to="/login" replace />
          } />
          
          {/* 404 처리 */}
          <Route path="*" element={<div>페이지를 찾을 수 없습니다.</div>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;