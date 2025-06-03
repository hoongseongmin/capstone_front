// 파일 위치: src/pages/Character.js
// 설명: 사용자의 소비 캐릭터 분석 및 추천 페이지

import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Paper, Typography, Box, Card, CardContent,
  Avatar, Chip, List, ListItem, ListItemIcon, ListItemText,
  LinearProgress, Alert
} from '@mui/material';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import Navigation from '../components/Navigation';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// 캐릭터 데이터 import
import { 
  findMatchingCharacter, 
  loadUserSpendingData
} from '../data/characterData';

const Character = () => {
  const [matchingResult, setMatchingResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 캐릭터 이미지 매핑 객체
  const characterImages = {
    tiger: '/assets/characters/tiger.png',
    horse: '/assets/characters/horse.png', 
    panda: '/assets/characters/panda.png',
    bird: '/assets/characters/bird.png',
    dog: '/assets/characters/dog.png',
    cat: '/assets/characters/cat.png'
  };

  useEffect(() => {
    try {
      console.log('🎯 캐릭터 분석 시작...');
      
      // 사용자 소비 데이터 로드
      const userSpending = loadUserSpendingData();
      console.log('📊 로드된 데이터:', userSpending);
      
      // 4개 카테고리 총합 계산
      const totalSpending = Object.values(userSpending).reduce((sum, amount) => sum + amount, 0);
      console.log('💰 총 지출액:', totalSpending, '만원');
      
      // 지출이 없는 경우 에러 처리
      if (totalSpending === 0) {
        setError('분석 가능한 거래 데이터가 없습니다. 파일을 업로드해주세요.');
        setLoading(false);
        return;
      }
      
      // 매칭 캐릭터 찾기
      const result = findMatchingCharacter(userSpending);
      console.log('🦄 매칭 결과:', result);
      setMatchingResult(result);
      
      setLoading(false);
    } catch (err) {
      console.error('❌ 캐릭터 분석 중 오류:', err);
      setError('캐릭터 분석 중 오류가 발생했습니다.');
      setLoading(false);
    }
  }, []);

  // 패턴 비교 차트 데이터 생성
  const generateComparisonData = () => {
    if (!matchingResult) return [];
    
    const categories = ['식비', '교통비', '통신비', '여가비'];
    return categories.map(category => ({
      category,
      '내 패턴': matchingResult.userPattern[category] || 0,
      [`${matchingResult.character.name} 패턴`]: matchingResult.character.pattern[category] || 0
    }));
  };

  // 파이 차트 데이터 생성
  const generatePieData = () => {
    if (!matchingResult) return [];
    
    return Object.entries(matchingResult.userPattern).map(([category, value]) => ({
      name: category,
      value: value,
      color: getColorByCategory(category)
    }));
  };

  // 카테고리별 색상
  const getColorByCategory = (category) => {
    const colors = {
      '식비': '#FF6B6B',
      '교통비': '#4ECDC4', 
      '통신비': '#45B7D1',
      '여가비': '#96CEB4'
    };
    return colors[category] || '#DDD';
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
          <Typography>캐릭터 분석 중...</Typography>
        </Container>
      </>
    );
  }

  if (error || !matchingResult) {
    return (
      <>
        <Navigation />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Typography variant="body2" color="text.secondary" align="center">
            파일 업로드 페이지에서 거래 내역을 업로드하시면 정확한 캐릭터 분석을 받으실 수 있습니다.
          </Typography>
        </Container>
      </>
    );
  }

  const { character, similarity } = matchingResult;

  return (
    <>
      <Navigation />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          내 소비 캐릭터 분석
        </Typography>

        <Grid container spacing={3}>
          {/* 매칭된 캐릭터 정보 */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <Avatar 
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      margin: '0 auto',
                      backgroundColor: character.color,
                      fontSize: '4rem'
                    }}
                  >
                    <img 
                      src={characterImages[character.id]} 
                      alt={character.name}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        borderRadius: '50%'
                      }}
                      onError={(e) => {
                        // 이미지 로드 실패시 이모지로 대체
                        e.target.style.display = 'none';
                        e.target.parentNode.innerHTML = character.emoji;
                      }}
                    />
                  </Avatar>
                </Box>
                
                <Typography variant="h4" component="h2" gutterBottom>
                  {character.name}
                </Typography>
                
                <Chip 
                  label={character.type} 
                  color="primary" 
                  sx={{ mb: 2, fontSize: '1rem', padding: '8px' }}
                />
                
                <Typography variant="body1" paragraph>
                  {character.description}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    유사도
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={similarity} 
                    sx={{ height: 8, borderRadius: 4, mt: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {Math.round(similarity)}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* 내 소비 패턴 차트 */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                내 소비 패턴
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={generatePieData()}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {generatePieData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* 캐릭터 특성 */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                {character.name}의 특성
              </Typography>
              <List>
                {character.traits.map((trait, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <Box 
                        sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          backgroundColor: character.color 
                        }} 
                      />
                    </ListItemIcon>
                    <ListItemText primary={trait} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* 개선 팁 */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                <TipsAndUpdatesIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                맞춤 개선 팁
              </Typography>
              <List>
                {character.tips.map((tip, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <TipsAndUpdatesIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={tip} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* 패턴 비교 차트 */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                캐릭터 패턴 비교
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={generateComparisonData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                    <Bar 
                      dataKey="내 패턴" 
                      fill="#8884d8" 
                      name="내 소비 패턴"
                    />
                    <Bar 
                      dataKey={`${character.name} 패턴`} 
                      fill={character.color} 
                      name={`${character.name} 표준 패턴`}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Character;