// 파일 위치: /src/pages/Comparison.js
// 설명: 실제 업로드된 데이터를 활용한 소비 패턴 비교 페이지

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, Grid, Paper, Typography, Box, Button, Alert
} from '@mui/material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell
} from 'recharts';
import Navigation from '../components/Navigation';

import { 
  categories, 
  genderData,
  ageData,
  regionData,
  occupationData,
  incomeData,
  loadUserSpendingData
} from '../data/statisticsData';

// 성별 옵션
const genderOptions = [
  { value: 'male', label: '남성' },
  { value: 'female', label: '여성' }
];

// 연령대 옵션
const ageOptions = [
  { value: '19-24', label: '19~24세' },
  { value: '25-29', label: '25~29세' },
  { value: '30-34', label: '30~34세' },
  { value: '35-39', label: '35~39세' },
  { value: '40-44', label: '40~44세' },
  { value: '45-49', label: '45~49세' },
  { value: '50-54', label: '50~54세' }
];

// 지역 옵션
const regionOptions = [
  { value: '서울', label: '서울' },
  { value: '인천·경기·강원', label: '인천·경기·강원' },
  { value: '대전·세종·충청', label: '대전·세종·충청' },
  { value: '대구·경북', label: '대구·경북' },
  { value: '부산·울산·경남', label: '부산·울산·경남' },
  { value: '광주·전라·제주', label: '광주·전라·제주' }
];

// 직업 옵션
const occupationOptions = [
  { value: '대학생·대학원생', label: '대학생·대학원생(휴학생 포함)' },
  { value: '직장인', label: '직장인' },
  { value: '자영업자·개인사업자·법인사업자', label: '자영업자·개인사업자·법인사업자' },
  { value: '프리랜서·파트타임·아르바이트', label: '프리랜서·파트타임·아르바이트' },
  { value: '전업주부', label: '전업주부' },
  { value: '취업준비생·무직·기타', label: '취업준비생·무직·기타' }
];

// 개인소득 옵션
const incomeOptions = [
  { value: '100만원 미만', label: '100만원 미만' },
  { value: '100만원~300만원', label: '100만원~300만원' },
  { value: '300만원 이상', label: '300만원 이상' }
];

// 🔥 카테고리 매핑 함수 (백엔드 카테고리 → 통계 데이터 카테고리)
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

const Comparison = () => {
  // 에러 상태 추가
  const [error, setError] = useState('');

  // 사용자 선택 상태 관리
  const [userSelections, setUserSelections] = useState({
    gender: 'male',
    age: '30-34',
    region: '서울',
    occupation: '직장인',
    income: '300만원 이상'
  });

  // 선택된 카테고리
  const [selectedCategory, setSelectedCategory] = useState('식비');
  
  // 비교 데이터 상태
  const [comparisonData, setComparisonData] = useState([]);
  
  // 사용자 데이터
  const [userData, setUserData] = useState({});
  const [realUserCategories, setRealUserCategories] = useState([]);

  // 🔥 실제 업로드된 데이터에서 카테고리별 지출 계산 (원 단위)
  const calculateUserSpendingByCategory = (transactions) => {
    const categorySpending = {};
    
    transactions.forEach(transaction => {
      const category = mapBackendCategoryToStatCategory(transaction.category);
      const amountInWon = transaction.amount; // 원 단위 그대로 사용
      
      if (!categorySpending[category]) {
        categorySpending[category] = 0;
      }
      categorySpending[category] += amountInWon;
    });
    
    console.log('🔍 사용자 카테고리별 지출 계산 결과:', categorySpending);
    return categorySpending;
  };

  // 선택된 카테고리에 대한 5개 집단과의 비교 데이터 생성
  const generateCategoryComparisonData = useCallback((category) => {
    if (!category) return [];

    // 선택된 특성 값 가져오기
    const { gender, age, region, occupation, income } = userSelections;
    
    // 🔥 실제 사용자 데이터에서 해당 카테고리 지출 가져오기
    const userValue = Math.round((userData[category] || 0) / 10000); // 원 → 만원 변환 (비교용)
    
    // 각 그룹별 값 (기본값 0)
    const genderValue = (genderData[gender] && genderData[gender][category]) || 0;
    const ageValue = (ageData[age] && ageData[age][category]) || 0;
    const regionValue = (regionData[region] && regionData[region][category]) || 0;
    const occupationValue = (occupationData[occupation] && occupationData[occupation][category]) || 0;
    const incomeValue = (incomeData[income] && incomeData[income][category]) || 0;
    
    // 비교 데이터 생성
    return [
      { name: '나', value: userValue },
      { name: `${genderOptions.find(o => o.value === gender)?.label}`, value: genderValue },
      { name: `${ageOptions.find(o => o.value === age)?.label}`, value: ageValue },
      { name: `${regionOptions.find(o => o.value === region)?.label}`, value: regionValue },
      { name: `${occupationOptions.find(o => o.value === occupation)?.label}`, value: occupationValue },
      { name: `${incomeOptions.find(o => o.value === income)?.label}`, value: incomeValue }
    ];
  }, [userSelections, userData]);

  // 카테고리 선택 핸들러
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  // 색상 배열 (바 차트 색상)
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

  // useEffect - 초기화 및 데이터 로드
  useEffect(() => {
    console.log('🔍 Comparison 페이지 데이터 로딩 시작');
    
    // localStorage에서 사용자 특성 불러오기
    const savedCharacteristics = localStorage.getItem('userCharacteristics');
    if (savedCharacteristics) {
      const characteristics = JSON.parse(savedCharacteristics);
      setUserSelections(characteristics);
      console.log('✅ 사용자 특성 로드:', characteristics);
      setError(''); // 에러 초기화
    } else {
      // 특성이 없으면 기본값 설정
      setUserSelections({
        gender: 'male',
        age: '25-29',
        region: '서울',
        occupation: '대학생·대학원생',
        income: '100만원 미만'
      });
      setError('사용자 특성이 설정되지 않아 기본값으로 설정되었습니다. 정확한 비교를 위해 파일 업로드 페이지에서 특성을 설정해주세요.');
    }
    
    // 🔥 실제 업로드된 거래 데이터 불러오기
    const uploadedData = localStorage.getItem('userData');
    if (uploadedData) {
      try {
        const transactions = JSON.parse(uploadedData);
        console.log('✅ 실제 거래 데이터 로드:', transactions.length, '건');
        
        // 카테고리별 지출 계산
        const categorySpending = calculateUserSpendingByCategory(transactions);
        setUserData(categorySpending);
        
        // 실제 사용자가 지출한 카테고리들만 추출
        const userCategories = Object.keys(categorySpending).filter(cat => categorySpending[cat] > 0);
        setRealUserCategories(userCategories);
        
        // 첫 번째 카테고리를 기본 선택으로 설정
        if (userCategories.length > 0) {
          setSelectedCategory(userCategories[0]);
        }
        
        console.log('✅ 사용자 실제 지출 카테고리:', userCategories);
        
      } catch (err) {
        console.error('❌ 거래 데이터 파싱 오류:', err);
        // 오류 시 목업 데이터 사용
        const userSpendingData = loadUserSpendingData();
        setUserData(userSpendingData);
      }
    } else {
      console.log('⚠️ 업로드된 데이터 없음, 목업 데이터 사용');
      // 업로드된 데이터가 없으면 목업 데이터 사용
      const userSpendingData = loadUserSpendingData();
      setUserData(userSpendingData);
    }
  }, []);

  // 선택된 카테고리나 사용자 선택이 변경될 때 비교 데이터 업데이트
  useEffect(() => {
    const data = generateCategoryComparisonData(selectedCategory);
    setComparisonData(data);
    console.log('🔄 비교 데이터 업데이트:', selectedCategory, data);
  }, [selectedCategory, generateCategoryComparisonData]);

  return (
    <>
      <Navigation />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          소비 패턴 비교 분석
        </Typography>
        <Typography variant="body1" paragraph>
          업로드 시 선택한 특성을 바탕으로 비슷한 사람들과의 소비 패턴을 비교합니다.
        </Typography>

        {/* 에러 메시지 표시 */}
        {error && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

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

        {/* 🔥 실제 지출 카테고리 정보 표시 */}
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
          {/* 비교 결과 시각화 영역 - 전체 폭 사용 */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                카테고리별 소비 패턴 비교
              </Typography>
              
              {/* 🔥 실제 지출 카테고리 우선 표시 + 전체 카테고리 */}
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
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
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
    </>
  );
};

export default Comparison;