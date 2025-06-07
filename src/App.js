// 파일 위치: src/App.js
// 설명: CategoryEdit 페이지 라우트 추가
// 수정 내용: CategoryEdit import 추가 및 라우트 설정

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// 페이지 컴포넌트 import
import Login from './pages/Login';
import FileUpload from './pages/FileUpload';
import Dashboard from './pages/Dashboard';
import Comparison from './pages/Comparison';
import Character from './pages/Character';
import IntegratedAnalysis from './pages/IntegratedAnalysis';
import CategoryEdit from './pages/CategoryEdit'; // 🆕 추가

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
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw', 
        height: '100vh',
        backgroundImage: 'url(/images/msti-bear.png)',
        backgroundSize: 'cover',  // 화면 전체를 덮도록
        backgroundPosition: 'center center',  // 중앙 정렬
        backgroundRepeat: 'no-repeat',
        opacity: 0.75,  // 매우 연하게 (배경이므로)
        zIndex: -1,
        pointerEvents: 'none'
      }} />
       
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
                     
          <Route path="/character" element={
            <ProtectedRoute>
              <Character />
            </ProtectedRoute>
          } />
          <Route path="/integrated" element={
            <ProtectedRoute>
              <IntegratedAnalysis />
            </ProtectedRoute>
          } />
          
          {/* 🆕 카테고리 수정 페이지 라우트 추가 */}
          <Route path="/category-edit" element={
            <ProtectedRoute>
              <CategoryEdit />
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