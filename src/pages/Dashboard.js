// 파일 위치: src/pages/Dashboard.js
// 설명: 카테고리 수정 기능이 추가된 대시보드

import Navigation from '../components/Navigation';
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, Grid, Paper, Typography, Box, CircularProgress,
  List, ListItem, ListItemText, Divider, Card, CardContent,
  Button, Select, MenuItem, FormControl, Chip
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

// 랜덤 색상 생성 함수
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#6B66FF'];
const getRandomColor = (index) => COLORS[index % COLORS.length];

// 사용 가능한 카테고리 목록
const AVAILABLE_CATEGORIES = [
  '식비', '교통비', '통신비', '주거비', '의료비', '교육비', 
  '생활용품비', '이미용/화장품', '온라인 컨텐츠', '여가비', 
  '경조사비', '금융비', '기타'
];

// 카테고리별 색상 매핑
const getCategoryColor = (category) => {
  const colorMap = {
    '식비': '#FF6B6B',
    '교통비': '#4ECDC4',
    '통신비': '#45B7D1',
    '주거비': '#96CEB4',
    '의료비': '#FFEAA7',
    '교육비': '#DDA0DD',
    '생활용품비': '#98D8C8',
    '이미용/화장품': '#F7DC6F',
    '온라인 컨텐츠': '#BB8FCE',
    '여가비': '#85C1E9',
    '경조사비': '#F8C471',
    '금융비': '#82E0AA',
    '기타': '#D5DBDB'
  };
  return colorMap[category] || '#D5DBDB';
};

const Dashboard = () => {
  // 기존 상태 관리
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [spendingPattern, setSpendingPattern] = useState(null);
  const [monthlyTrend, setMonthlyTrend] = useState(null);
  const [error, setError] = useState('');

  // 🆕 수정 기능 관련 상태
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTransactions, setEditingTransactions] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  // 월별 트렌드 데이터 생성 함수
  const generateMonthlyTrend = useCallback((transactions) => {
    const monthlyMap = {};
    
    transactions.forEach(transaction => {
      let date;
      try {
        date = new Date(transaction.transaction_date);
        if (isNaN(date.getTime())) {
          date = new Date();
        }
      } catch {
        date = new Date();
      }
      
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
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

  // 카테고리 요약 재계산 함수
  const recalculateCategorySummary = useCallback((updatedTransactions) => {
    const categorySummary = {};
    let totalAmount = 0;

    // 카테고리별 집계
    updatedTransactions.forEach(transaction => {
      const category = transaction.category;
      const amount = transaction.amount;

      if (!categorySummary[category]) {
        categorySummary[category] = {
          count: 0,
          total_amount: 0
        };
      }

      categorySummary[category].count += 1;
      categorySummary[category].total_amount += amount;
      totalAmount += amount;
    });

    // 퍼센트 계산
    Object.keys(categorySummary).forEach(category => {
      categorySummary[category].percentage = totalAmount > 0 ? 
        (categorySummary[category].total_amount / totalAmount) * 100 : 0;
    });

    return categorySummary;
  }, []);

  // 데이터 저장 함수
  const saveChanges = useCallback(() => {
    try {
      // localStorage 업데이트
      localStorage.setItem('userData', JSON.stringify(editingTransactions));
      
      // 카테고리 요약 재계산 및 저장
      const newCategorySummary = recalculateCategorySummary(editingTransactions);
      localStorage.setItem('categorySummary', JSON.stringify(newCategorySummary));
      
      // 상태 업데이트
      setTransactions(editingTransactions);
      
      // 파이차트용 데이터 업데이트
      const categoryBreakdown = Object.entries(newCategorySummary).map(([categoryName, data]) => ({
        category_id: categoryName,
        category_name: categoryName,
        total_amount: data.total_amount,
        percentage: data.percentage,
        transaction_count: data.count
      }));

      const totalSpending = categoryBreakdown.reduce((sum, cat) => sum + cat.total_amount, 0);
      
      setSpendingPattern({
        total_spending: totalSpending,
        category_breakdown: categoryBreakdown
      });

      // 월별 트렌드 업데이트
      const monthlyData = generateMonthlyTrend(editingTransactions);
      setMonthlyTrend({ monthly_totals: monthlyData });

      // 편집 모드 종료
      setIsEditMode(false);
      setHasChanges(false);

      console.log('✅ 변경사항 저장 완료');
    } catch (error) {
      console.error('❌ 저장 중 오류:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  }, [editingTransactions, recalculateCategorySummary, generateMonthlyTrend]);

  // 편집 모드 시작
  const startEditMode = useCallback(() => {
    setEditingTransactions([...transactions]);
    setIsEditMode(true);
    setHasChanges(false);
  }, [transactions]);

  // 편집 취소
  const cancelEdit = useCallback(() => {
    setIsEditMode(false);
    setEditingTransactions([]);
    setHasChanges(false);
  }, []);

  // 카테고리 변경 핸들러
  const handleCategoryChange = useCallback((index, newCategory) => {
    const updatedTransactions = [...editingTransactions];
    updatedTransactions[index] = {
      ...updatedTransactions[index],
      category: newCategory
    };
    setEditingTransactions(updatedTransactions);
    setHasChanges(true);
  }, [editingTransactions]);

  // 실제 데이터 로딩 함수
  const loadRealData = useCallback(async () => {
    try {
      setLoading(true);
      
      const userData = localStorage.getItem('userData');
      const categorySummary = localStorage.getItem('categorySummary');
      
      console.log('🔍 저장된 데이터 확인:');
      console.log('userData:', userData ? '있음' : '없음');
      console.log('categorySummary:', categorySummary ? '있음' : '없음');
      
      if (userData) {
        const parsedTransactions = JSON.parse(userData);
        setTransactions(parsedTransactions);
        console.log('✅ 실제 거래 데이터 로드:', parsedTransactions.length, '건');
        
        const monthlyData = generateMonthlyTrend(parsedTransactions);
        setMonthlyTrend({ monthly_totals: monthlyData });
        console.log('✅ 월별 트렌드 데이터 생성:', monthlyData.length, '개월');
      }
      
      if (categorySummary) {
        const parsedCategorySummary = JSON.parse(categorySummary);
        console.log('✅ 카테고리 요약 데이터 로드:', parsedCategorySummary);
        
        const categoryBreakdown = Object.entries(parsedCategorySummary).map(([categoryName, data]) => ({
          category_id: categoryName,
          category_name: categoryName,
          total_amount: data.total_amount,
          percentage: data.percentage,
          transaction_count: data.count
        }));
        
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
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setUser(parsedUser);
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

          {/* 🆕 최근 거래 내역 - 카테고리 수정 기능 추가 */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="div">
                  최근 거래 내역 ({transactions?.length || 0}건)
                </Typography>
                
                {/* 수정/저장/취소 버튼 */}
                <Box>
                  {!isEditMode ? (
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={startEditMode}
                      disabled={!transactions || transactions.length === 0}
                    >
                      카테고리 수정
                    </Button>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={saveChanges}
                        disabled={!hasChanges}
                        color="primary"
                      >
                        저장
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={cancelEdit}
                        color="secondary"
                      >
                        취소
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* 편집 모드 안내 */}
              {isEditMode && (
                <Box sx={{ mb: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                  <Typography variant="body2" color="info.contrastText">
                    💡 파란색 카테고리 버튼을 클릭하여 카테고리를 변경할 수 있습니다. 변경 후 저장 버튼을 눌러주세요.
                  </Typography>
                </Box>
              )}

              {transactions && transactions.length > 0 ? (
                <Box 
                  sx={{ 
                    maxHeight: 600,
                    overflow: 'auto',
                    border: '1px solid #e0e0e0',
                    borderRadius: 1
                  }}
                >
                  <List>
                    {(isEditMode ? editingTransactions : transactions).map((transaction, index) => (
                      <React.Fragment key={transaction.transaction_date + index}>
                        <ListItem>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="subtitle1">
                                  {transaction.store_name} - ₩{transaction.amount?.toLocaleString()}
                                </Typography>
                                
                                {/* 🆕 카테고리 표시/수정 */}
                                {isEditMode ? (
                                  <FormControl size="small" sx={{ minWidth: 120 }}>
                                    <Select
                                      value={transaction.category}
                                      onChange={(e) => handleCategoryChange(index, e.target.value)}
                                      sx={{
                                        bgcolor: getCategoryColor(transaction.category),
                                        color: 'white',
                                        '& .MuiSelect-icon': { color: 'white' },
                                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                                      }}
                                    >
                                      {AVAILABLE_CATEGORIES.map((category) => (
                                        <MenuItem key={category} value={category}>
                                          {category}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                ) : (
                                  <Chip
                                    label={transaction.category}
                                    sx={{
                                      bgcolor: getCategoryColor(transaction.category),
                                      color: 'white'
                                    }}
                                  />
                                )}
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
                        {index < (isEditMode ? editingTransactions : transactions).length - 1 && <Divider />}
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