// 파일 위치: src/pages/CategoryEdit.js
// 설명: 카테고리 수정 전용 페이지 - 좌측 차트(1/3) + 우측 수정(2/3) 레이아웃
// 협업 가이드: 
// 1. 좌측: 실시간 업데이트 카테고리별 지출 분포 차트
// 2. 우측: 거래내역 카테고리 수정 영역
// 3. 실시간 반영: 우측에서 카테고리 변경 시 좌측 차트 즉시 업데이트
// 4. 2:1 비율 레이아웃으로 수정 작업에 더 많은 공간 할애

import Navigation from '../components/Navigation';
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, Grid, Paper, Typography, Box, CircularProgress,
  List, ListItem, ListItemText, Divider, Button, 
  Select, MenuItem, FormControl, Chip, Alert
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useNavigate } from 'react-router-dom';

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

const CategoryEdit = () => {
  const navigate = useNavigate();
  
  // 상태 관리
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // 수정 기능 관련 상태
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTransactions, setEditingTransactions] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  // 🆕 실시간 차트 데이터 상태
  const [chartData, setChartData] = useState([]);

  // 🆕 차트 데이터 생성 함수
  const generateChartData = useCallback((transactionList) => {
    const categorySummary = {};
    let totalAmount = 0;

    // 카테고리별 집계
    transactionList.forEach(transaction => {
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

    // 차트 데이터 생성
    const chartData = Object.entries(categorySummary)
      .map(([categoryName, data]) => ({
        category: categoryName,
        amount: Math.round(data.total_amount / 10000), // 만원 단위
        originalAmount: data.total_amount,
        percentage: totalAmount > 0 ? (data.total_amount / totalAmount) * 100 : 0,
        count: data.count,
        color: getCategoryColor(categoryName)
      }))
      .sort((a, b) => b.amount - a.amount) // 내림차순 정렬
      .slice(0, 10); // 상위 10개

    return chartData;
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
      
      // 편집 모드 종료
      setIsEditMode(false);
      setHasChanges(false);

      // 성공 메시지 표시
      setSuccessMessage('✅ 카테고리 수정이 완료되었습니다!');
      setTimeout(() => setSuccessMessage(''), 3000);

      console.log('✅ 변경사항 저장 완료');
    } catch (error) {
      console.error('❌ 저장 중 오류:', error);
      setError('저장 중 오류가 발생했습니다.');
    }
  }, [editingTransactions, recalculateCategorySummary]);

  // 편집 모드 시작
  const startEditMode = useCallback(() => {
    setEditingTransactions([...transactions]);
    setIsEditMode(true);
    setHasChanges(false);
    setSuccessMessage(''); // 성공 메시지 초기화
  }, [transactions]);

  // 편집 취소
  const cancelEdit = useCallback(() => {
    setIsEditMode(false);
    setEditingTransactions([]);
    setHasChanges(false);
    setSuccessMessage('');
    
    // 🆕 차트 데이터를 원래 데이터로 복원
    const originalChartData = generateChartData(transactions);
    setChartData(originalChartData);
  }, [transactions, generateChartData]);

  // 🆕 카테고리 변경 핸들러 - 실시간 차트 업데이트 포함
  const handleCategoryChange = useCallback((index, newCategory) => {
    const updatedTransactions = [...editingTransactions];
    updatedTransactions[index] = {
      ...updatedTransactions[index],
      category: newCategory
    };
    setEditingTransactions(updatedTransactions);
    setHasChanges(true);

    // 🆕 실시간 차트 데이터 업데이트
    const newChartData = generateChartData(updatedTransactions);
    setChartData(newChartData);
  }, [editingTransactions, generateChartData]);

  // 뒤로가기 함수
  const handleGoBack = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm('저장하지 않은 변경사항이 있습니다. 정말 나가시겠습니까?');
      if (!confirmLeave) return;
    }
    navigate(-1); // 이전 페이지로
  };

  // 통합페이지로 이동
  const handleGoToIntegrated = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm('저장하지 않은 변경사항이 있습니다. 정말 나가시겠습니까?');
      if (!confirmLeave) return;
    }
    navigate('/integrated');
  };

  // 데이터 로딩 함수
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      const userData = localStorage.getItem('userData');
      
      if (userData) {
        const parsedTransactions = JSON.parse(userData);
        setTransactions(parsedTransactions);
        
        // 🆕 초기 차트 데이터 생성
        const initialChartData = generateChartData(parsedTransactions);
        setChartData(initialChartData);
        
        console.log('✅ 거래 데이터 로드:', parsedTransactions.length, '건');
      } else {
        setError('거래 데이터를 찾을 수 없습니다. 파일을 먼저 업로드해주세요.');
      }
      
    } catch (err) {
      console.error("❌ 데이터 로딩 중 오류 발생:", err);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [generateChartData]);

  // 초기화
  useEffect(() => {
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setUser(parsedUser);
    }
    
    loadData();
  }, [loadData]);

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

  return (
    <>
      <Navigation />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* 페이지 헤더 */}
        <Paper sx={{ p: 3, mb: 3, width : 1122 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                🏷️ 거래 카테고리 수정
              </Typography>
              <Typography variant="body1" color="text.secondary">
                좌측에서 실시간 변화를 확인하며 우측에서 카테고리를 수정하세요.
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
              sx={{ ml: 2 }}
            >
              뒤로가기
            </Button>
          </Box>
        </Paper>

        {/* 성공 메시지 */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}

        {/* 에러 메시지 */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* 🆕 메인 콘텐츠: 2:1 비율 레이아웃 */}
        <Grid container spacing={3}>
          {/* 🆕 좌측: 실시간 차트 (1/3) */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '700px', display: 'flex', flexDirection: 'column' ,width : 450}}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, width : 400}}>
                <TrendingUpIcon color="primary" />
                <Typography variant="h6">
                  실시간 지출 분포
                </Typography>
                {isEditMode && (
                  <Chip 
                    label="편집 중" 
                    size="small" 
                    color="warning" 
                    variant="outlined"
                  />
                )}
              </Box>

              {chartData && chartData.length > 0 ? (
                <>
                  {/* 요약 정보 */}
                  <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">총 지출</Typography>
                    <Typography variant="h6" color="primary">
                      {Math.round(chartData.reduce((sum, item) => sum + item.originalAmount, 0)).toLocaleString()}원
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {chartData.length}개 카테고리
                    </Typography>
                  </Box>

                  {/* 차트 */}
                  <Box sx={{ flex: 1, minHeight: 350 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                        barCategoryGap="15%"
                      >
                        <CartesianGrid 
                          strokeDasharray="3 3" 
                          stroke="#f0f0f0" 
                          horizontal={true}
                          vertical={false}
                        />
                        <XAxis 
                          type="number" 
                          domain={[0, 'dataMax + 5']}
                          tickFormatter={(value) => `${value}만원`}
                          tick={{ fontSize: 10, fill: '#666' }}
                        />
                        <YAxis 
                          type="category"
                          dataKey="category" 
                          width={75}
                          tick={{ fontSize: 10, fill: '#333' }}
                          tickFormatter={(value) => value.length > 5 ? value.substring(0, 4) + '..' : value}
                        />
                        <Tooltip 
                          content={({ active, payload, label }) => {
                            if (active && payload && payload[0]) {
                              const data = payload[0].payload;
                              return (
                                <Box sx={{ 
                                  bgcolor: 'rgba(255, 255, 255, 0.95)', 
                                  border: '1px solid #ddd',
                                  borderRadius: 1,
                                  p: 1.5,
                                  boxShadow: 2
                                }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                    {data.category}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    💰 {data.originalAmount.toLocaleString()}원
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    📊 {data.percentage.toFixed(1)}%
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    🔢 {data.count}건
                                  </Typography>
                                </Box>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar 
                          dataKey="amount"
                          radius={[0, 4, 4, 0]}
                        >
                          {chartData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.color}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>

                  {/* 상위 카테고리 칩 */}
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary" gutterBottom sx={{ display: 'block' }}>
                      상위 카테고리
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {chartData.slice(0, 4).map((item, index) => (
                        <Chip
                          key={item.category}
                          label={`${item.category} ${item.amount}만원`}
                          size="small"
                          sx={{ 
                            backgroundColor: item.color,
                            color: 'white',
                            fontSize: '0.7rem'
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </>
              ) : (
                <Box sx={{ 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'center', 
                  alignItems: 'center',
                  border: '2px dashed #e0e0e0',
                  borderRadius: 2,
                  bgcolor: 'grey.50'
                }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    📊 차트 데이터 없음
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    거래 데이터를 불러오는 중입니다
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* 🆕 우측: 거래 내역 수정 (2/3) */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, height: '700px', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 , width :600}}>
                <Box>
                  <Typography variant="h5" component="h2" gutterBottom>
                    거래 내역 ({transactions?.length || 0}건)
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {isEditMode ? '카테고리 변경 시 좌측 차트에서 실시간 확인 가능' : '편집 모드를 시작하여 카테고리를 수정하세요'}
                  </Typography>
                </Box>
                
                {/* 수정/저장/취소 버튼 */}
                <Box>
                  {!isEditMode ? (
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={startEditMode}
                      disabled={!transactions || transactions.length === 0}
                      size="large"
                    >
                      편집 시작
                    </Button>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={saveChanges}
                        disabled={!hasChanges}
                        color="primary"
                        size="large"
                      >
                        저장 {hasChanges && '(변경됨)'}
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={cancelEdit}
                        color="secondary"
                        size="large"
                      >
                        취소
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* 편집 모드 안내 */}
              {isEditMode && (
                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    💡 <strong>실시간 편집 모드</strong> - 카테고리를 변경하면 좌측 차트가 즉시 업데이트됩니다!
                  </Typography>
                </Alert>
              )}

              {/* 거래 내역 리스트 */}
              {transactions && transactions.length > 0 ? (
                <Box 
                  sx={{ 
                    flex: 1,
                    overflow: 'auto',
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    maxHeight: '500px' // 🆕 최대 높이 설정으로 스크롤 활성화
                  }}
                >
                  <List sx={{ p: 0 }}>
                    {(isEditMode ? editingTransactions : transactions).map((transaction, index) => (
                      <React.Fragment key={transaction.transaction_date + index}>
                        <ListItem sx={{ py: 2, px: 3 }}>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Box>
                                  <Typography variant="subtitle1" component="div">
                                    {transaction.store_name}
                                  </Typography>
                                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                                    ₩{transaction.amount?.toLocaleString()}
                                  </Typography>
                                </Box>
                                
                                {/* 카테고리 표시/수정 */}
                                {isEditMode ? (
                                  <FormControl size="medium" sx={{ minWidth: 140 }}>
                                    <Select
                                      value={transaction.category}
                                      onChange={(e) => handleCategoryChange(index, e.target.value)}
                                      sx={{
                                        bgcolor: getCategoryColor(transaction.category),
                                        color: 'white',
                                        fontWeight: 'bold',
                                        '& .MuiSelect-icon': { color: 'white' },
                                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                        '&:hover': {
                                          bgcolor: getCategoryColor(transaction.category),
                                          opacity: 0.9
                                        }
                                      }}
                                    >
                                      {AVAILABLE_CATEGORIES.map((category) => (
                                        <MenuItem key={category} value={category}>
                                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box 
                                              sx={{ 
                                                width: 12, 
                                                height: 12, 
                                                borderRadius: '50%', 
                                                bgcolor: getCategoryColor(category) 
                                              }} 
                                            />
                                            {category}
                                          </Box>
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                ) : (
                                  <Chip
                                    label={transaction.category}
                                    sx={{
                                      bgcolor: getCategoryColor(transaction.category),
                                      color: 'white',
                                      fontWeight: 'bold'
                                    }}
                                  />
                                )}
                              </Box>
                            }
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                <Typography component="div" variant="body2" color="text.primary" sx={{ mb: 0.5 }}>
                                  📅 {new Date(transaction.transaction_date).toLocaleDateString('ko-KR')} 
                                  ⏰ {new Date(transaction.transaction_date).toLocaleTimeString('ko-KR', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </Typography>
                                
                                {transaction.description && (
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                    📝 {transaction.description}
                                  </Typography>
                                )}
                                
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < (isEditMode ? editingTransactions : transactions).length - 1 && (
                          <Divider variant="middle" />
                        )}
                      </React.Fragment>
                    ))}
                  </List>
                </Box>
              ) : (
                <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50', flex: 1 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    📋 거래 내역이 없습니다
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    파일을 업로드하면 거래 내역을 확인하고 카테고리를 수정할 수 있습니다.
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => navigate('/upload')}
                  >
                    파일 업로드하기
                  </Button>
                </Paper>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default CategoryEdit;