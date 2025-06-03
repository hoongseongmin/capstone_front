// 파일 위치: src/pages/Dashboard.js
// 설명: 백엔드 API에서 받은 실제 데이터를 활용하여 개선된 대시보드 (React Hook 경고 수정)

import Navigation from '../components/Navigation';
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, Grid, Paper, Typography, Box, CircularProgress,
  List, ListItem, ListItemText, Divider, Card, CardContent 
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

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

  // 🔥 월별 트렌드 데이터 생성 함수
  
const generateMonthlyTrend = useCallback((transactions) => {
    const monthlyMap = {};
    
    transactions.forEach(transaction => {
        // 🔥 날짜 파싱 개선
        let date;
        try {
            date = new Date(transaction.transaction_date);
            // 유효하지 않은 날짜 체크
            if (isNaN(date.getTime())) {
                date = new Date(); // 현재 날짜로 대체
            }
        } catch {
            date = new Date(); // 현재 날짜로 대체
        }
        
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        // 나머지 로직은 동일
        if (!monthlyMap[monthKey]) {
            monthlyMap[monthKey] = {
                month: monthKey,
                total_amount: 0,
                transaction_count: 0
            };
        }
        
        monthlyMap[monthKey].total_amount += transaction.amount;
        monthlyMap[monthKey].transaction_count += 1;
    });
    
    return Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month));
}, []);

  // 🔥 실제 데이터 로딩 함수 (useCallback으로 메모이제이션)
  const loadRealData = useCallback(async () => {
    try {
      setLoading(true);
      
      // 저장된 실제 데이터 가져오기
      const userData = localStorage.getItem('userData');
      const categorySummary = localStorage.getItem('categorySummary');
      const classificationSummary = localStorage.getItem('classificationSummary');
      
      console.log('🔍 저장된 데이터 확인:');
      console.log('userData:', userData ? '있음' : '없음');
      console.log('categorySummary:', categorySummary ? '있음' : '없음');
      console.log('classificationSummary:', classificationSummary ? '있음' : '없음');
      
      if (userData) {
        const parsedTransactions = JSON.parse(userData);
        setTransactions(parsedTransactions);
        console.log('✅ 실제 거래 데이터 로드:', parsedTransactions.length, '건');
        
        // 월별 트렌드 데이터 생성 (실제 거래 데이터 기반)
        const monthlyData = generateMonthlyTrend(parsedTransactions);
        setMonthlyTrend({ monthly_totals: monthlyData });
        console.log('✅ 월별 트렌드 데이터 생성:', monthlyData.length, '개월');
      }
      
      if (categorySummary) {
        const parsedCategorySummary = JSON.parse(categorySummary);
        console.log('✅ 카테고리 요약 데이터 로드:', parsedCategorySummary);
        
        // 파이차트용 데이터 변환
        const categoryBreakdown = Object.entries(parsedCategorySummary).map(([categoryName, data]) => ({
          category_id: categoryName,
          category_name: categoryName,
          total_amount: data.total_amount,
          percentage: data.percentage,
          transaction_count: data.count
        }));
        
        // 총 지출 계산
        const totalSpending = categoryBreakdown.reduce((sum, cat) => sum + cat.total_amount, 0);
        
        setSpendingPattern({
          total_spending: totalSpending,
          category_breakdown: categoryBreakdown
        });
        
        console.log('✅ 지출 패턴 데이터 설정 완료, 총 지출:', totalSpending);
      }
      
    } catch (err) {
      console.error("❌ 실제 데이터 로딩 중 오류 발생:", err);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [generateMonthlyTrend]);

  useEffect(() => {
    // LocalStorage에서 사용자 정보 가져오기
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setUser(parsedUser);
      
      // 🔥 실제 업로드된 데이터 로드
      loadRealData();
    } else {
      setError('사용자 정보를 찾을 수 없습니다.');
      setLoading(false);
    }
  }, [loadRealData]);

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
          <Grid item xs={12} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  총 지출
                </Typography>
                <Typography variant="h3" component="div" color="primary">
                  ₩{spendingPattern?.total_spending?.toLocaleString() || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {transactions?.length || 0}건의 거래
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* 평균 거래 금액 */}
          <Grid item xs={12} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  평균 거래 금액
                </Typography>
                <Typography variant="h3" component="div" color="secondary">
                  ₩{transactions?.length > 0 ? 
                    Math.round((spendingPattern?.total_spending || 0) / transactions.length).toLocaleString() : 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  거래 당 평균
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* 최다 사용 카테고리 */}
          <Grid item xs={12} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  최다 사용 카테고리
                </Typography>
                <Typography variant="h3" component="div" color="success.main">
                  {spendingPattern?.category_breakdown?.[0]?.category_name || '없음'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {spendingPattern?.category_breakdown?.[0]?.percentage?.toFixed(1) || 0}% 차지
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* 카테고리 수 */}
          <Grid item xs={12} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  카테고리 수
                </Typography>
                <Typography variant="h3" component="div" color="info.main">
                  {spendingPattern?.category_breakdown?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  지출 카테고리
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* 카테고리별 지출 차트 */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
              <Typography variant="h6" gutterBottom component="div">
                카테고리별 지출 분포
              </Typography>
              {spendingPattern?.category_breakdown && spendingPattern.category_breakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={spendingPattern.category_breakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="total_amount"
                      nameKey="category_name"
                      label={({ category_name, percentage }) => `${category_name} ${percentage?.toFixed(1)}%`}
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
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
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
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'total_amount' ? `₩${value.toLocaleString()}` : value,
                        name === 'total_amount' ? '총 지출' : '거래 건수'
                      ]} 
                    />
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

          {/* 최근 거래 내역 - 스크롤 기능 추가 */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom component="div">
                최근 거래 내역 ({transactions?.length || 0}건)
              </Typography>
              {transactions && transactions.length > 0 ? (
                <Box 
                  sx={{ 
                    maxHeight: 600, // 최대 높이 설정
                    overflow: 'auto', // 스크롤 가능하도록 설정
                    border: '1px solid #e0e0e0', // 경계선 추가
                    borderRadius: 1
                  }}
                >
                  <List>
                    {transactions.map((transaction, index) => (
                      <React.Fragment key={transaction.transaction_date + index}>
                        <ListItem>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="subtitle1">
                                  {transaction.store_name} - ₩{transaction.amount?.toLocaleString()}
                                </Typography>
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    bgcolor: 'primary.main', 
                                    color: 'white', 
                                    px: 1, 
                                    py: 0.5, 
                                    borderRadius: 1 
                                  }}
                                >
                                  {transaction.category}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <React.Fragment>
                                <Typography component="span" variant="body2" color="text.primary">
                                  {new Date(transaction.transaction_date).toLocaleDateString('ko-KR')} 
                                  {' '}
                                  {new Date(transaction.transaction_date).toLocaleTimeString('ko-KR', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </Typography>
                                {transaction.description && ` — ${transaction.description}`}
                                <br />
                                <Typography variant="caption" color="text.secondary">
                                  결제수단: {transaction.payment_method}
                                </Typography>
                              </React.Fragment>
                            }
                          />
                        </ListItem>
                        {index < transactions.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </Box>
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