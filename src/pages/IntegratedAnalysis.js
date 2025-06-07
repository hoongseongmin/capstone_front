// 파일 위치: src/pages/IntegratedAnalysis.js
// 설명: 캐릭터 분석, 대시보드, 소비 비교를 통합한 원페이지 컴포넌트 (레이아웃 개선)

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Container, Grid, Paper, Typography, Box, Card, CardContent,
  Avatar, Chip, List, ListItem, ListItemIcon, ListItemText,
  LinearProgress, Alert, Fab, CircularProgress, Button, Divider,
  Select, MenuItem, FormControl
} from '@mui/material';
import { 
  BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer
} from 'recharts';
import Navigation from '../components/Navigation';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

// 기존 페이지에서 사용하던 import들
import { 
  findMatchingCharacter, 
  loadUserSpendingData
} from '../data/characterData';
import { 
  categories, 
  genderData,
  ageData,
  regionData,
  occupationData,
  incomeData
} from '../data/statisticsData';

const IntegratedAnalysis = () => {
  // ===== 공통 상태 =====
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  // ===== 캐릭터 분석 상태 =====
  const [matchingResult, setMatchingResult] = useState(null);

  // ===== 대시보드 상태 =====
  const [transactions, setTransactions] = useState([]);
  const [spendingPattern, setSpendingPattern] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTransactions, setEditingTransactions] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  // ===== 소비 비교 상태 =====
  const [userSelections, setUserSelections] = useState({
    gender: 'male',
    age: '30-34',
    region: '서울',
    occupation: '직장인',
    income: '300만원 이상'
  });
  const [selectedCategory, setSelectedCategory] = useState('식비');
  const [comparisonData, setComparisonData] = useState([]);
  const [userData, setUserData] = useState({});
  const [realUserCategories, setRealUserCategories] = useState([]);

  // ===== 스크롤 관련 =====
  const sectionRefs = {
    character: useRef(null),
    dashboard: useRef(null),
    comparison: useRef(null)
  };
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState('character');

  // ===== 유틸리티 함수들 =====
  const characterImages = {
    tiger: '/assets/characters/tiger.png',
    horse: '/assets/characters/horse.png', 
    panda: '/assets/characters/panda.png',
    bird: '/assets/characters/bird.png',
    dog: '/assets/characters/dog.png',
    cat: '/assets/characters/cat.png'
  };

  const getCategoryColor = (category) => {
    const colors = {
      '식비': '#FF6B6B',
      '교통비': '#4ECDC4', 
      '통신비': '#45B7D1',
      '여가비': '#96CEB4',
      '주거비': '#FFEAA7',
      '의료비': '#DDA0DD',
      '교육비': '#98D8C8',
      '생활용품비': '#F7DC6F',
      '이미용/화장품': '#BB8FCE',
      '온라인 컨텐츠': '#85C1E9',
      '경조사비': '#F8C471',
      '금융비': '#82E0AA',
      '기타': '#D5DBDB'
    };
    return colors[category] || '#D5DBDB';
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#6B66FF'];

  // ===== 옵션 데이터 =====
  const genderOptions = [
    { value: 'male', label: '남성' },
    { value: 'female', label: '여성' }
  ];

  const ageOptions = [
    { value: '19-24', label: '19~24세' },
    { value: '25-29', label: '25~29세' },
    { value: '30-34', label: '30~34세' },
    { value: '35-39', label: '35~39세' },
    { value: '40-44', label: '40~44세' },
    { value: '45-49', label: '45~49세' },
    { value: '50-54', label: '50~54세' }
  ];

  const regionOptions = [
    { value: '서울', label: '서울' },
    { value: '인천·경기·강원', label: '인천·경기·강원' },
    { value: '대전·세종·충청', label: '대전·세종·충청' },
    { value: '대구·경북', label: '대구·경북' },
    { value: '부산·울산·경남', label: '부산·울산·경남' },
    { value: '광주·전라·제주', label: '광주·전라·제주' }
  ];

  const occupationOptions = [
    { value: '대학생·대학원생', label: '대학생·대학원생(휴학생 포함)' },
    { value: '직장인', label: '직장인' },
    { value: '자영업자·개인사업자·법인사업자', label: '자영업자·개인사업자·법인사업자' },
    { value: '프리랜서·파트타임·아르바이트', label: '프리랜서·파트타임·아르바이트' },
    { value: '전업주부', label: '전업주부' },
    { value: '취업준비생·무직·기타', label: '취업준비생·무직·기타' }
  ];

  const incomeOptions = [
    { value: '100만원 미만', label: '100만원 미만' },
    { value: '100만원~300만원', label: '100만원~300만원' },
    { value: '300만원 이상', label: '300만원 이상' }
  ];

  const AVAILABLE_CATEGORIES = [
    '식비', '교통비', '통신비', '주거비', '의료비', '교육비', 
    '생활용품비', '이미용/화장품', '온라인 컨텐츠', '여가비', 
    '경조사비', '금융비', '기타'
  ];

  // ===== 카테고리 매핑 함수 =====
  const mapBackendCategoryToStatCategory = (backendCategory) => {
    const mapping = {
      '식비': '식비',
      '생활용품비': '생활용품비',
      '통신비': '통신비',
      '기타': '기타',
      '주거비': '주거비',
      '교통비': '교통비',
      '의료비': '의료비',
      '교육비': '교육비',
      '여가비': '여가비',
      '이미용/화장품': '이미용/화장품',
      '온라인 컨텐츠': '온라인 컨텐츠',
      '경조사비': '경조사비',
      '금융비': '금융비'
    };
    return mapping[backendCategory] || '기타';
  };

  // ===== 카테고리별 지출 차트 데이터 생성 =====
  const generateCategoryBarData = () => {
    if (!spendingPattern?.category_breakdown) return [];
    
    return spendingPattern.category_breakdown
      .map(item => ({
        category: item.category_name,
        amount: Math.round(item.total_amount / 10000), // 만원 단위
        color: getCategoryColor(item.category_name)
      }))
      .sort((a, b) => b.amount - a.amount); // 내림차순 정렬
  };

  // ===== 사용자 데이터 계산 =====
  const calculateUserSpendingByCategory = (transactions) => {
    const categorySpending = {};
    
    transactions.forEach(transaction => {
      const category = mapBackendCategoryToStatCategory(transaction.category);
      const amountInWon = transaction.amount;
      
      if (!categorySpending[category]) {
        categorySpending[category] = 0;
      }
      categorySpending[category] += amountInWon;
    });
    
    return categorySpending;
  };

  // ===== 비교 데이터 생성 =====
  const generateCategoryComparisonData = useCallback((category) => {
    if (!category) return [];

    const { gender, age, region, occupation, income } = userSelections;
    const userValue = Math.round((userData[category] || 0) / 10000);
    
    const genderValue = (genderData[gender] && genderData[gender][category]) || 0;
    const ageValue = (ageData[age] && ageData[age][category]) || 0;
    const regionValue = (regionData[region] && regionData[region][category]) || 0;
    const occupationValue = (occupationData[occupation] && occupationData[occupation][category]) || 0;
    const incomeValue = (incomeData[income] && incomeData[income][category]) || 0;
    
    return [
      { name: '나', value: userValue },
      { name: `${genderOptions.find(o => o.value === gender)?.label}`, value: genderValue },
      { name: `${ageOptions.find(o => o.value === age)?.label}`, value: ageValue },
      { name: `${regionOptions.find(o => o.value === region)?.label}`, value: regionValue },
      { name: `${occupationOptions.find(o => o.value === occupation)?.label}`, value: occupationValue },
      { name: `${incomeOptions.find(o => o.value === income)?.label}`, value: incomeValue }
    ];
  }, [userSelections, userData]);

  // ===== 카테고리 요약 재계산 =====
  const recalculateCategorySummary = useCallback((updatedTransactions) => {
    const categorySummary = {};
    let totalAmount = 0;

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

    Object.keys(categorySummary).forEach(category => {
      categorySummary[category].percentage = totalAmount > 0 ? 
        (categorySummary[category].total_amount / totalAmount) * 100 : 0;
    });

    return categorySummary;
  }, []);

  // ===== 편집 관련 함수들 =====
  const saveChanges = useCallback(() => {
    try {
      localStorage.setItem('userData', JSON.stringify(editingTransactions));
      
      const newCategorySummary = recalculateCategorySummary(editingTransactions);
      localStorage.setItem('categorySummary', JSON.stringify(newCategorySummary));
      
      setTransactions(editingTransactions);
      
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

      setIsEditMode(false);
      setHasChanges(false);

      console.log('✅ 변경사항 저장 완료');
    } catch (error) {
      console.error('❌ 저장 중 오류:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  }, [editingTransactions, recalculateCategorySummary]);

  const startEditMode = useCallback(() => {
    setEditingTransactions([...transactions]);
    setIsEditMode(true);
    setHasChanges(false);
  }, [transactions]);

  const cancelEdit = useCallback(() => {
    setIsEditMode(false);
    setEditingTransactions([]);
    setHasChanges(false);
  }, []);

  const handleCategoryChange = useCallback((index, newCategory) => {
    const updatedTransactions = [...editingTransactions];
    updatedTransactions[index] = {
      ...updatedTransactions[index],
      category: newCategory
    };
    setEditingTransactions(updatedTransactions);
    setHasChanges(true);
  }, [editingTransactions]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  // ===== 스크롤 관련 함수들 =====
  const scrollToSection = (sectionName) => {
    sectionRefs[sectionName].current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ===== 스크롤 이벤트 핸들러 =====
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowScrollTop(scrollY > 300);

      // 현재 보이는 섹션 감지
      const sections = Object.keys(sectionRefs);
      let currentSection = 'character';

      sections.forEach(section => {
        const element = sectionRefs[section].current;
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section;
          }
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ===== 데이터 로딩 =====
  const loadRealData = useCallback(async () => {
    try {
      setLoading(true);
      
      const userData = localStorage.getItem('userData');
      const categorySummary = localStorage.getItem('categorySummary');
      
      if (userData) {
        const parsedTransactions = JSON.parse(userData);
        setTransactions(parsedTransactions);
      }
      
      if (categorySummary) {
        const parsedCategorySummary = JSON.parse(categorySummary);
        
        const categoryBreakdown = Object.entries(parsedCategorySummary).map(([categoryName, data]) => ({
          category_id: categoryName,
          category_name: categoryName,
          total_amount: data.total_amount,
          percentage: data.percentage,
          transaction_count: data.count || data.transaction_count || 0
        }));
        
        const totalSpending = categoryBreakdown.reduce((sum, cat) => sum + cat.total_amount, 0);
        
        setSpendingPattern({
          total_spending: totalSpending,
          category_breakdown: categoryBreakdown
        });
      }
      
    } catch (err) {
      console.error("❌ 실제 데이터 로딩 중 오류 발생:", err);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  // ===== 초기화 useEffect =====
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

    // 캐릭터 분석 로드
    try {
      const userSpending = loadUserSpendingData();
      const totalSpending = Object.values(userSpending).reduce((sum, amount) => sum + amount, 0);
      
      if (totalSpending === 0) {
        setError('분석 가능한 거래 데이터가 없습니다. 파일을 업로드해주세요.');
      } else {
        const result = findMatchingCharacter(userSpending);
        setMatchingResult(result);
      }
    } catch (err) {
      console.error('❌ 캐릭터 분석 중 오류:', err);
    }

    // 소비 비교 데이터 로드
    const savedCharacteristics = localStorage.getItem('userCharacteristics');
    if (savedCharacteristics) {
      const characteristics = JSON.parse(savedCharacteristics);
      setUserSelections(characteristics);
    }
    
    const uploadedData = localStorage.getItem('userData');
    if (uploadedData) {
      try {
        const transactions = JSON.parse(uploadedData);
        const categorySpending = calculateUserSpendingByCategory(transactions);
        setUserData(categorySpending);
        
        const userCategories = Object.keys(categorySpending).filter(cat => categorySpending[cat] > 0);
        setRealUserCategories(userCategories);
        
        if (userCategories.length > 0) {
          setSelectedCategory(userCategories[0]);
        }
      } catch (err) {
        console.error('❌ 거래 데이터 파싱 오류:', err);
        const userSpendingData = loadUserSpendingData();
        setUserData(userSpendingData);
      }
    } else {
      const userSpendingData = loadUserSpendingData();
      setUserData(userSpendingData);
    }
  }, [loadRealData]);

  // ===== 비교 데이터 업데이트 =====
  useEffect(() => {
    const data = generateCategoryComparisonData(selectedCategory);
    setComparisonData(data);
  }, [selectedCategory, generateCategoryComparisonData]);

  // ===== 로딩 상태 =====
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
      
      {/* 플로팅 네비게이션 */}
      <Box sx={{ 
        position: 'fixed', 
        right: 20, 
        top: '50%', 
        transform: 'translateY(-50%)', 
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}>
        <Button
          variant={activeSection === 'character' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => scrollToSection('character')}
          startIcon={<PersonIcon />}
          sx={{ minWidth: 120 }}
        >
          내 캐릭터
        </Button>
        <Button
          variant={activeSection === 'dashboard' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => scrollToSection('dashboard')}
          startIcon={<DashboardIcon />}
          sx={{ minWidth: 120 }}
        >
          대시보드
        </Button>
        <Button
          variant={activeSection === 'comparison' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => scrollToSection('comparison')}
          startIcon={<CompareArrowsIcon />}
          sx={{ minWidth: 120 }}
        >
          소비 비교
        </Button>
      </Box>

      {/* 스크롤 탑 버튼 */}
      {showScrollTop && (
        <Fab
          color="primary"
          size="small"
          onClick={scrollToTop}
          sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      )}

      {/* ===================== 캐릭터 분석 섹션 ===================== */}
      <Box ref={sectionRefs.character} sx={{ minHeight: '100vh', py: 4 }}>
        <Box sx={{ px: 4, maxWidth: '1400px', mx: 'auto' }}>
          <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
            🎯 내 소비 캐릭터 분석
          </Typography>

          {error && !matchingResult ? (
            <Alert severity="warning" sx={{ mb: 4, textAlign: 'center' }}>
              {error}
            </Alert>
          ) : matchingResult && (
            <Grid container spacing={3}>
              {/* 개선된 레이아웃 */}
            <Grid container spacing={3}>
              {/* 캐릭터 정보 카드 - 더 좁게 */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, position: 'relative', width : 500, height: 740, overflow: 'hidden' }}>
                  {/* 캐릭터 정보 박스 */}
                  <Box sx={{ 
                    height: 'calc(100% - 32px)', 
                    display: 'flex', 
                    flexDirection: 'column',
                    pr: 2,
                    overflow: 'hidden'
                  }}>
                    {/* 캐릭터 기본 정보 */}
                    <Box sx={{ textAlign: 'center', mb: 2, flex: '0 0 auto' }}>
                      <Avatar 
                        sx={{ 
                          width: 250, 
                          height: 250, 
                          margin: '0 auto',
                          backgroundColor: matchingResult.character.color,
                          fontSize: '2.5rem',
                          mb: 2
                        }}
                      >
                        <img 
                          src={characterImages[matchingResult.character.id]} 
                          alt={matchingResult.character.name}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            borderRadius: '50%'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentNode.innerHTML = matchingResult.character.emoji;
                          }}
                        />
                      </Avatar>
                      
                      <Typography variant="h5" component="h2" gutterBottom>
                        {matchingResult.character.name}
                      </Typography>
                      
                      <Chip 
                        label={matchingResult.character.type} 
                        color="primary" 
                        sx={{ mb: 2, fontSize: '0.8rem' }}
                      />
                      
                      <Typography variant="body2" paragraph sx={{ px: 1, fontSize: '0.85rem' }}>
                        {matchingResult.character.description}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          유사도
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={matchingResult.similarity} 
                          sx={{ height: 8, borderRadius: 4, mt: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {Math.round(matchingResult.similarity)}%
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    {/* 특성과 개선 팁을 스크롤 가능한 영역으로 */}
                    <Box sx={{ flex: '1 1 auto', overflow: 'auto' }}>
                      {/* 특성 */}
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem' }}>
                          <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: '1.2rem' }} />
                          특성
                        </Typography>
                        <List dense>
                          {matchingResult.character.traits.map((trait, index) => (
                            <ListItem key={index} sx={{ py: 0.2, pl: 0 }}>
                              <ListItemIcon sx={{ minWidth: 20 }}>
                                <Box 
                                  sx={{ 
                                    width: 6, 
                                    height: 6, 
                                    borderRadius: '50%', 
                                    backgroundColor: matchingResult.character.color 
                                  }} 
                                />
                              </ListItemIcon>
                              <ListItemText 
                                primary={trait} 
                                primaryTypographyProps={{ variant: 'body2', fontSize: '0.85rem' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>

                      {/* 개선 팁 */}
                      <Box>
                        <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem' }}>
                          <TipsAndUpdatesIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: '1.2rem' }} />
                          맞춤 개선 팁
                        </Typography>
                        <List dense>
                          {matchingResult.character.tips.map((tip, index) => (
                            <ListItem key={index} sx={{ py: 0.2, pl: 0 }}>
                              <ListItemIcon sx={{ minWidth: 20 }}>
                                <TipsAndUpdatesIcon color="primary" sx={{ fontSize: '0.9rem' }} />
                              </ListItemIcon>
                              <ListItemText 
                                primary={tip} 
                                primaryTypographyProps={{ variant: 'body2', fontSize: '0.85rem' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

      {/* 카테고리별 지출 분포 - 새로 개선된 버전 */}
<Grid item xs={12} md={8}>
  <Paper sx={{ p: 3, height: 740, width : 800, display: 'flex', flexDirection: 'column' }}>
    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      📊 카테고리별 지출 분포
      {spendingPattern?.category_breakdown && (
        <Chip 
          label={`${spendingPattern.category_breakdown.length}개 카테고리`} 
          size="small" 
          color="primary" 
        />
      )}
    </Typography>

    {/* 데이터 확인 및 차트 렌더링 */}
    {(() => {
      console.log('🔍 spendingPattern:', spendingPattern);
      console.log('🔍 category_breakdown:', spendingPattern?.category_breakdown);
      
      // 차트 데이터 생성 (새로운 방식)
      const chartData = spendingPattern?.category_breakdown 
        ? spendingPattern.category_breakdown
            .filter(item => item.total_amount > 0)
            .map((item, index) => ({
              id: item.category_id || index,
              category: item.category_name || '미분류',
              amount: Math.round(item.total_amount / 10000), // 만원 단위
              originalAmount: item.total_amount,
              percentage: item.percentage || 0,
              count: item.transaction_count || 0,
              color: getCategoryColor(item.category_name) || COLORS[index % COLORS.length]
            }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 10) // 상위 10개만
        : [];

      console.log('📊 생성된 차트 데이터:', chartData);

      if (chartData.length === 0) {
        return (
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
              📈 지출 데이터가 없습니다
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              파일을 업로드하면 카테고리별 지출 분포를 확인할 수 있습니다
            </Typography>
            <Button 
              variant="outlined" 
              sx={{ mt: 2 }}
              onClick={() => window.location.href = '/upload'}
            >
              파일 업로드하기
            </Button>
          </Box>
        );
      }

      return (
        <>
          {/* 요약 정보 */}
          <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Typography variant="caption" color="text.secondary">총 지출</Typography>
                <Typography variant="h6" color="primary">
                  {Math.round(spendingPattern.total_spending)}원
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="caption" color="text.secondary">최고 지출 카테고리</Typography>
                <Typography variant="h6" color="error.main">
                  {chartData[0]?.category}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="caption" color="text.secondary">최고 비율</Typography>
                <Typography variant="h6" color="warning.main">
                  {chartData[0]?.percentage?.toFixed(1)}%
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* 차트 영역 */}
          <Box sx={{ flex: 1, minHeight: 400, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 20, right: 40, left: 100, bottom: 20 }}
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
                  axisLine={{ stroke: '#e0e0e0' }}
                  tickLine={{ stroke: '#e0e0e0' }}
                  tick={{ fontSize: 11, fill: '#666' }}
                />
                <YAxis 
                  type="category"
                  dataKey="category" 
                  width={100}
                  axisLine={{ stroke: '#e0e0e0' }}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#333' }}
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
                            💰 지출액: ₩{data.originalAmount.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            📊 비율: {data.percentage.toFixed(1)}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            🔢 거래 수: {data.count}회
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
                  stroke="rgba(255, 255, 255, 0.8)"
                  strokeWidth={1}
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

          {/* 하단 카테고리 범례 */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary" gutterBottom sx={{ display: 'block' }}>
              상위 카테고리 ({chartData.length}개)
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {chartData.slice(0, 6).map((item, index) => (
                <Chip
                  key={item.id}
                  label={`${item.category} ${item.amount}만원`}
                  size="small"
                  sx={{ 
                    backgroundColor: item.color,
                    color: 'white',
                    fontSize: '0.75rem',
                    '& .MuiChip-label': { px: 1 }
                  }}
                />
              ))}
              {chartData.length > 6 && (
                <Chip
                  label={`+${chartData.length - 6}개 더`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              )}
            </Box>
          </Box>
        </>
      );
    })()}
  </Paper>
</Grid>
            </Grid>
            </Grid>
          )}
        </Box>
      </Box>
      {/* ===================== 대시보드 섹션 ===================== */}
      <Box ref={sectionRefs.dashboard} sx={{ minHeight: '100vh', py: 4, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
            📊 내 소비 대시보드
          </Typography>

          <Grid container spacing={3}>
            {/* 소비 비율 가장 높음 (금액 기준) */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" component="div" gutterBottom color="primary">
                    💰 소비 비율 가장 높음
                  </Typography>
                  <Typography variant="h2" component="div" color="error.main" sx={{ my: 2 }}>
                    {spendingPattern?.category_breakdown?.[0]?.category_name || '없음'}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    전체 지출의 {spendingPattern?.category_breakdown?.[0]?.percentage?.toFixed(1) || 0}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    ₩{spendingPattern?.category_breakdown?.[0]?.total_amount?.toLocaleString() || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* 소비 횟수 많음 (거래 건수 기준) */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" component="div" gutterBottom color="secondary">
                    🔄 소비 횟수 많음
                  </Typography>
                  <Typography variant="h2" component="div" color="info.main" sx={{ my: 2 }}>
                    {spendingPattern?.category_breakdown
                      ?.sort((a, b) => b.transaction_count - a.transaction_count)[0]?.category_name || '없음'}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    총 {spendingPattern?.category_breakdown
                      ?.sort((a, b) => b.transaction_count - a.transaction_count)[0]?.transaction_count || 0}회 거래
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    평균 ₩{spendingPattern?.category_breakdown
                      ?.sort((a, b) => b.transaction_count - a.transaction_count)[0]?.transaction_count > 0 
                      ? Math.round((spendingPattern?.category_breakdown
                          ?.sort((a, b) => b.transaction_count - a.transaction_count)[0]?.total_amount || 0) / 
                        (spendingPattern?.category_breakdown
                          ?.sort((a, b) => b.transaction_count - a.transaction_count)[0]?.transaction_count || 1)).toLocaleString()
                      : 0} / 회
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* 최근 거래 내역 - 카테고리 수정 기능 */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="div">
                    최근 거래 내역 ({transactions?.length || 0}건)
                  </Typography>
                  
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

                {isEditMode && (
                  <Box sx={{ mb: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                    <Typography variant="body2" color="info.contrastText">
                      💡 카테고리를 클릭하여 변경할 수 있습니다. 변경 후 저장 버튼을 눌러주세요.
                    </Typography>
                  </Box>
                )}

                {transactions && transactions.length > 0 ? (
                  <Box 
                    sx={{ 
                      maxHeight: 400,
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
      </Box>

      {/* ===================== 소비 비교 섹션 ===================== */}
      <Box ref={sectionRefs.comparison} sx={{ minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
            📈 소비 패턴 비교 분석
          </Typography>
          
          <Typography variant="body1" paragraph align="center">
            업로드 시 선택한 특성을 바탕으로 비슷한 사람들과의 소비 패턴을 비교합니다.
          </Typography>

          {/* 현재 선택된 특성 표시 */}
          <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>
              현재 설정된 특성
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="body2">
                <strong>성별:</strong> {genderOptions.find(o => o.value === userSelections.gender)?.label || '미설정'}
              </Typography>
              <Typography variant="body2">
                <strong>연령:</strong> {ageOptions.find(o => o.value === userSelections.age)?.label || '미설정'}
              </Typography>
              <Typography variant="body2">
                <strong>거주지:</strong> {userSelections.region || '미설정'}
              </Typography>
              <Typography variant="body2">
                <strong>직업:</strong> {userSelections.occupation || '미설정'}
              </Typography>
              <Typography variant="body2">
                <strong>소득:</strong> {userSelections.income || '미설정'}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              * 특성을 변경하려면 파일 업로드 페이지에서 다시 설정해주세요.
            </Typography>
          </Paper>

          {/* 실제 지출 카테고리 정보 표시 */}
          {realUserCategories.length > 0 && (
            <Paper sx={{ p: 2, mb: 3, bgcolor: 'info.light', color: 'info.contrastText' }}>
              <Typography variant="h6" gutterBottom>
                내 실제 지출 카테고리
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {realUserCategories.map(category => (
                  <Typography 
                    key={category}
                    variant="body2" 
                    sx={{ 
                      bgcolor: 'white', 
                      color: 'text.primary', 
                      px: 1, 
                      py: 0.5, 
                      borderRadius: 1 
                    }}
                  >
                    {category}: ₩ {userData[category]?.toLocaleString()}원
                  </Typography>
                ))}
              </Box>
              <Typography variant="caption" sx={{ mt: 1, display: 'block', opacity: 0.8 }}>
                * 업로드한 거래 내역에서 자동으로 계산된 카테고리별 지출액입니다.
              </Typography>
            </Paper>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  카테고리별 소비 패턴 비교
                </Typography>
                
                {/* 카테고리 선택 버튼들 */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    내 지출 카테고리 (우선 표시)
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {realUserCategories.map(category => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "contained" : "outlined"}
                        onClick={() => handleCategorySelect(category)}
                        size="small"
                        color="primary"
                        sx={{ mb: 1 }}
                      >
                        {category} (₩{userData[category]?.toLocaleString()}원)
                      </Button>
                    ))}
                  </Box>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    전체 카테고리
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {categories.map(category => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "contained" : "outlined"}
                        onClick={() => handleCategorySelect(category)}
                        size="small"
                        color={realUserCategories.includes(category) ? "primary" : "secondary"}
                        sx={{ mb: 1 }}
                      >
                        {category}
                      </Button>
                    ))}
                  </Box>
                </Box>
                
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  선택한 카테고리: {selectedCategory} 
                  {userData[selectedCategory] ? `(내 지출: ₩${userData[selectedCategory].toLocaleString()}원)` : '(지출 없음)'}
                </Typography>
                
                <Box sx={{ height: 400, mt: 3 }}>
                  {comparisonData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={comparisonData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip formatter={(value) => `${value.toLocaleString()}만원`} />
                        <Legend />
                        <Bar dataKey="value" name={`${selectedCategory} 지출액`} fill="#8884d8">
                          {comparisonData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      <Typography>비교 데이터가 없습니다.</Typography>
                    </Box>
                  )}
                </Box>

                {/* 차이점 분석 */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    분석 결과
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {selectedCategory} 항목에서 내 지출(₩{(userData[selectedCategory] || 0).toLocaleString()}원)은
                    {comparisonData.slice(1).map((item, index) => {
                      const userAmount = comparisonData[0]?.value || 0;
                      const groupAmount = item.value || 0;
                      
                      if (groupAmount === 0) {
                        return (
                          <span key={index}>
                            {' '}{item.name} 평균 데이터가 없습니다
                            {index < comparisonData.length - 2 ? ',' : index === comparisonData.length - 2 ? '.' : ''}
                          </span>
                        );
                      }
                      
                      const diff = ((userAmount - groupAmount) / groupAmount * 100).toFixed(1);
                      const isHigher = userAmount > groupAmount;
                      
                      return (
                        <span key={index}>
                          {' '}
                          {item.name} 평균({item.value.toLocaleString()}만원)보다 
                          <strong style={{ color: isHigher ? 'red' : 'green' }}>
                            {' '}{isHigher ? `${diff}% 많습니다` : `${Math.abs(diff)}% 적습니다`}
                          </strong>
                          {index < comparisonData.length - 2 ? ',' : index === comparisonData.length - 2 ? '.' : ''}
                        </span>
                      );
                    })}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default IntegratedAnalysis;