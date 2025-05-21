import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, Grid, Paper, Typography, Radio, RadioGroup, 
  FormControlLabel, FormControl, FormLabel, Box,
  Card, CardContent, Button, ButtonGroup
} from '@mui/material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell  // Cell 컴포넌트 추가
} from 'recharts';
import Navigation from '../components/Navigation';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


// 데이터 파일에서 함수와 데이터 가져오기
import { 
  categories, 
  genderData,
  ageData,
  regionData,
  occupationData,
  incomeData,
  mockUserSpending,
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

const Comparison = () => {
  // 사용자 선택 상태 관리
  const [userSelections, setUserSelections] = useState({
    gender: 'male',
    age: '30-34',
    region: '서울',
    occupation: '직장인',
    income: '300만원 이상'
  });

  // 선택된 카테고리
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  
  // 비교 데이터 상태
  const [comparisonData, setComparisonData] = useState([]);
  
  // 사용자 데이터
  const [userData, setUserData] = useState(mockUserSpending);

  // 선택된 카테고리에 대한 5개 집단과의 비교 데이터 생성
  const generateCategoryComparisonData = useCallback((category) => {
    if (!category) return [];

    // 선택된 특성 값 가져오기
    const { gender, age, region, occupation, income } = userSelections;
    
    // 사용자 값 (기본값 0)
    const userValue = userData[category] || 0;
    
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

  // 선택 변경 핸들러
  const handleSelectionChange = (event) => {
    const { name, value } = event.target;
    setUserSelections(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 카테고리 선택 핸들러
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  // 색상 배열 (바 차트 색상)
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

  useEffect(() => {
    // 로컬 스토리지에서 사용자 데이터 불러오기
    const userSpendingData = loadUserSpendingData();
    setUserData(userSpendingData);
  }, []);

  useEffect(() => {
    // 카테고리나 선택된 특성이 변경될 때 비교 데이터 업데이트
    if (selectedCategory) {
      const newData = generateCategoryComparisonData(selectedCategory);
      setComparisonData(newData);
    }
  }, [selectedCategory, userSelections, userData, generateCategoryComparisonData]);

  return (
    <>
      <Navigation />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          소비 패턴 비교 분석
        </Typography>
        <Typography variant="body1" paragraph>
          나와 비슷한 특성을 가진 사람들의 평균 소비 패턴과 내 소비 패턴을 비교해보세요.
        </Typography>

        <Grid container spacing={3}>
          {/* 사용자 특성 선택 영역 */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                내 특성 선택
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* 성별 선택 */}
                <FormControl component="fieldset">
                  <FormLabel component="legend">성별</FormLabel>
                  <RadioGroup
                    row
                    name="gender"
                    value={userSelections.gender}
                    onChange={handleSelectionChange}
                  >
                    {genderOptions.map(option => (
                      <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio />}
                        label={option.label}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>

                {/* 연령대 선택 */}
                <FormControl component="fieldset">
                  <FormLabel component="legend">연령대</FormLabel>
                  <RadioGroup
                    row
                    name="age"
                    value={userSelections.age}
                    onChange={handleSelectionChange}
                  >
                    {ageOptions.map(option => (
                      <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio />}
                        label={option.label}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>

                {/* 지역 선택 */}
                <FormControl component="fieldset">
                  <FormLabel component="legend">거주지</FormLabel>
                  <RadioGroup
                    row
                    name="region"
                    value={userSelections.region}
                    onChange={handleSelectionChange}
                  >
                    {regionOptions.map(option => (
                      <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio />}
                        label={option.label}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>

                {/* 직업 선택 */}
                <FormControl component="fieldset">
                  <FormLabel component="legend">직업</FormLabel>
                  <RadioGroup
                    row
                    name="occupation"
                    value={userSelections.occupation}
                    onChange={handleSelectionChange}
                  >
                    {occupationOptions.map(option => (
                      <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio />}
                        label={option.label}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>

                {/* 개인소득 선택 */}
                <FormControl component="fieldset">
                  <FormLabel component="legend">개인소득</FormLabel>
                  <RadioGroup
                    row
                    name="income"
                    value={userSelections.income}
                    onChange={handleSelectionChange}
                  >
                    {incomeOptions.map(option => (
                      <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio />}
                        label={option.label}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Box>
            </Paper>
          </Grid>

          {/* 비교 결과 시각화 영역 */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                소비 패턴 비교
              </Typography>
              
              {/* 카테고리 버튼 그룹 */}
              <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "contained" : "outlined"}
                    onClick={() => handleCategorySelect(category)}
                    size="small"
                    sx={{ mb: 1 }}
                  >
                    {category}
                  </Button>
                ))}
              </Box>
              
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                선택한 카테고리: {selectedCategory}
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
                  {selectedCategory} 항목에서 내 지출({comparisonData[0]?.value.toLocaleString()}만원)은
                  {comparisonData.slice(1).map((item, index) => {
                    const diff = ((comparisonData[0]?.value - item.value) / item.value * 100).toFixed(1);
                    const isHigher = comparisonData[0]?.value > item.value;
                    
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