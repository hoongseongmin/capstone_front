// src/pages/Dashboard.js

import Navigation from '../components/Navigation';
import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Paper, Typography, Box, CircularProgress,
  List, ListItem, ListItemText, Divider, Card, CardContent 
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

// API 호출 함수 import
import { getUserTransactions } from '../api/transactionApi';
import { getSpendingPattern, getMonthlyTrend } from '../api/analysisApi';

// 랜덤 색상 생성 함수
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#6B66FF'];
const getRandomColor = (index) => COLORS[index % COLORS.length];

const Dashboard = () => {
  // 상태 관리
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [spendingPattern, setSpendingPattern] = useState(null);
  const [monthlyTrend, setMonthlyTrend] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // LocalStorage에서 사용자 정보 가져오기
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setUser(parsedUser);
      
      // 데이터 로딩
      loadDashboardData(parsedUser.id);
    } else {
      setError('사용자 정보를 찾을 수 없습니다.');
      setLoading(false);
    }
  }, []);

  // 대시보드 데이터 로딩 함수
  const loadDashboardData = async (userId) => {
    try {
      setLoading(true);
      
      // 병렬로 API 호출
      const [transactionsData, spendingData, monthlyData] = await Promise.all([
        getUserTransactions(userId),
        getSpendingPattern(userId),
        getMonthlyTrend(userId)
      ]);
      
      setTransactions(transactionsData);
      setSpendingPattern(spendingData);
      setMonthlyTrend(monthlyData);
      
    } catch (err) {
      console.error("대시보드 데이터 로딩 중 오류 발생:", err);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 로딩 중 표시
  if (loading) {
    return (
      <>
        <Navigation />
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <CircularProgress />
          </Box>
        </Container>
      </>  
    );
  }

  // 에러 표시
    if (error) {
    return (
      <>
        <Navigation />
        <Container maxWidth="lg">
          <Paper sx={{ p: 3, mt: 3, textAlign: 'center' }}>
            <Typography color="error">{error}</Typography>
          </Paper>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navigation />
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* 사용자 환영 메시지 */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              안녕하세요, {user?.name || '사용자'}님!
            </Typography>
            <Typography variant="body1">
              소비 패턴 분석 대시보드에 오신 것을 환영합니다.
            </Typography>
          </Paper>
        </Grid>

        {/* 총 지출 요약 */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                총 지출
              </Typography>
              <Typography variant="h3" component="div" color="primary">
                ₩{spendingPattern?.total_spending?.toLocaleString() || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                최근 6개월 기준
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* 카테고리 수 */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                카테고리 수
              </Typography>
              <Typography variant="h3" component="div" color="primary">
                {spendingPattern?.category_breakdown?.length || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                지출 카테고리
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* 거래 수 */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                거래 수
              </Typography>
              <Typography variant="h3" component="div" color="primary">
                {transactions?.length || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                기록된 거래 내역
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* 카테고리별 지출 차트 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}>
            <Typography variant="h6" gutterBottom component="div">
              카테고리별 지출
            </Typography>
            {spendingPattern?.category_breakdown && spendingPattern.category_breakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={spendingPattern.category_breakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="total_amount"
                    nameKey="category_name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {spendingPattern.category_breakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getRandomColor(index)} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`₩${value.toLocaleString()}`, '금액']}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Typography variant="body1">카테고리별 지출 데이터가 없습니다.</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* 월별 지출 트렌드 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}>
            <Typography variant="h6" gutterBottom component="div">
              월별 지출 트렌드
            </Typography>
            {monthlyTrend?.monthly_totals && monthlyTrend.monthly_totals.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyTrend.monthly_totals}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₩${value.toLocaleString()}`, '금액']} />
                  <Legend />
                  <Bar dataKey="total_amount" name="총 지출" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Typography variant="body1">월별 지출 데이터가 없습니다.</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* 최근 거래 내역 */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom component="div">
              최근 거래 내역
            </Typography>
            {transactions && transactions.length > 0 ? (
              <List>
                {transactions.slice(0, 5).map((transaction, index) => (
                  <React.Fragment key={transaction.id || index}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1">
                            {transaction.category_name} - ₩{transaction.amount?.toLocaleString()}
                          </Typography>
                        }
                        secondary={
                          <React.Fragment>
                            <Typography component="span" variant="body2" color="text.primary">
                              {new Date(transaction.transaction_date).toLocaleDateString()}
                            </Typography>
                            {transaction.description && ` — ${transaction.description}`}
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    {index < Math.min(transactions.length, 5) - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body1" sx={{ p: 2 }}>거래 내역이 없습니다.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
    </>
  );
};

export default Dashboard;