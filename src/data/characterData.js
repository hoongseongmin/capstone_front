// 파일 위치: src/data/characterData.js
// 설명: 소비 캐릭터 정의 및 사용자 패턴 매칭 로직

// 소비 캐릭터 정의 (식비, 교통, 통신, 여가 4개 카테고리 기준)
export const consumptionCharacters = {
  tiger: {
    id: 'tiger',
    name: '호랑이',
    type: '균형형',
    description: '모든 분야에 고르게 소비하는 균형잡힌 타입',
    pattern: {
      식비: 49,
      교통비: 17,
      통신비: 17,
      여가비: 17
    },
    traits: [
      '계획적이고 안정적인 소비 패턴',
      '어느 한 분야에 치우치지 않는 균형감',
      '전반적으로 합리적인 지출 관리'
    ],
    tips: [
      '현재 균형잡힌 소비를 유지하고 계세요!',
      '각 카테고리별 예산을 더 세분화해보세요',
      '정기적인 가계부 점검으로 균형을 유지하세요'
    ],
    color: '#FF6B35',
    emoji: '🐅'
  },
  horse: {
    id: 'horse',
    name: '말',
    type: '교통 위주형',
    description: '이동과 교통에 많은 비용을 투자하는 활동적인 타입',
    pattern: {
      식비: 62,
      교통비: 38,
      통신비: 0,
      여가비: 0
    },
    traits: [
      '활동적이고 이동이 많은 라이프스타일',
      '교통비 지출이 상당한 비중 차지',
      '통신이나 여가보다 실용적 소비 선호'
    ],
    tips: [
      '대중교통 정기권이나 할인 혜택을 활용해보세요',
      '카풀이나 공유 교통수단 이용을 고려해보세요',
      '통신비와 여가비도 조금씩 투자해보세요'
    ],
    color: '#8B4513',
    emoji: '🐎'
  },
  panda: {
    id: 'panda',
    name: '판다',
    type: '식비 위주형',
    description: '먹는 것을 가장 중요하게 생각하는 미식가 타입',
    pattern: {
      식비: 78,
      교통비: 0,
      통신비: 22,
      여가비: 0
    },
    traits: [
      '음식과 식사에 대한 높은 관심과 투자',
      '집에서 보내는 시간이 많음',
      '기본적인 통신비 외 다른 지출 최소화'
    ],
    tips: [
      '홈쿡을 늘려서 식비를 절약해보세요',
      '할인 혜택이나 쿠폰을 적극 활용하세요',
      '교통비나 여가비에도 소액 투자를 고려해보세요'
    ],
    color: '#000000',
    emoji: '🐼'
  },
  bird: {
    id: 'bird',
    name: '새',
    type: '통신 위주형',
    description: '소통과 연결을 중시하는 디지털 네이티브 타입',
    pattern: {
      식비: 26,
      교통비: 32,
      통신비: 42,
      여가비: 0
    },
    traits: [
      '디지털 기기와 통신 서비스에 높은 관심',
      '온라인 활동이 활발함',
      '이동도 어느 정도 있지만 통신이 우선'
    ],
    tips: [
      '통신 요금제를 정기적으로 점검하고 최적화하세요',
      '불필요한 구독 서비스는 정리해보세요',
      '여가비도 조금씩 늘려서 오프라인 활동을 해보세요'
    ],
    color: '#87CEEB',
    emoji: '🐦'
  },
  dog: {
    id: 'dog',
    name: '강아지',
    type: '여가 위주형',
    description: '놀이와 즐거움을 추구하는 활발한 타입',
    pattern: {
      식비: 59,
      교통비: 6,
      통신비: 6,
      여가비: 29
    },
    traits: [
      '여가와 엔터테인먼트에 적극적 투자',
      '즐거움과 경험을 중시하는 성향',
      '기본 생활비와 여가비의 조화'
    ],
    tips: [
      '여가 활동 예산을 미리 계획해보세요',
      '그룹 할인이나 멤버십 혜택을 활용하세요',
      '교통비와 통신비도 조금 더 투자해보세요'
    ],
    color: '#D2691E',
    emoji: '🐕'
  },
  cat: {
    id: 'cat',
    name: '고양이',
    type: '절약형',
    description: '여가비 제로! 실용적이고 검소한 생활을 추구하는 타입',
    pattern: {
      식비: 59,
      교통비: 20,
      통신비: 21,
      여가비: 0
    },
    traits: [
      '여가비 지출을 하지 않는 절약형',
      '필수 생활비에만 집중하는 실용주의',
      '계획적이고 신중한 소비 패턴'
    ],
    tips: [
      '절약하는 습관이 훌륭해요!',
      '가끔은 작은 여가비 투자로 삶의 질을 높여보세요',
      '현재 패턴을 유지하면서 비상금을 늘려보세요'
    ],
    color: '#696969',
    emoji: '🐱'
  }
};

// 캐릭터 목록 배열
export const characterList = Object.values(consumptionCharacters);

// 사용자 소비 패턴에서 4개 카테고리 비율 계산
export const calculateUserPattern = (userSpending) => {
  const categories = ['식비', '교통비', '통신비', '여가비'];
  
  // 4개 카테고리 총합 계산
  const total = categories.reduce((sum, category) => {
    return sum + (userSpending[category] || 0);
  }, 0);
  
  if (total === 0) {
    return { 식비: 0, 교통비: 0, 통신비: 0, 여가비: 0 };
  }
  
  // 각 카테고리별 비율 계산 (백분율)
  const pattern = {};
  categories.forEach(category => {
    pattern[category] = Math.round(((userSpending[category] || 0) / total) * 100);
  });
  
  return pattern;
};

// 두 패턴 간의 유클리드 거리 계산
export const calculateDistance = (pattern1, pattern2) => {
  const categories = ['식비', '교통비', '통신비', '여가비'];
  
  let distance = 0;
  categories.forEach(category => {
    const diff = (pattern1[category] || 0) - (pattern2[category] || 0);
    distance += diff * diff;
  });
  
  return Math.sqrt(distance);
};

// 사용자 패턴과 가장 유사한 캐릭터 찾기
export const findMatchingCharacter = (userSpending) => {
  const userPattern = calculateUserPattern(userSpending);
  
  let bestMatch = null;
  let minDistance = Infinity;
  
  characterList.forEach(character => {
    const distance = calculateDistance(userPattern, character.pattern);
    if (distance < minDistance) {
      minDistance = distance;
      bestMatch = character;
    }
  });
  
  return {
    character: bestMatch,
    userPattern: userPattern,
    similarity: Math.max(0, 100 - minDistance), // 유사도 점수 (0-100)
    distance: minDistance
  };
};

// 백엔드 카테고리를 캐릭터 분석용 4개 카테고리로 매핑
const mapToCharacterCategories = (backendCategory) => {
  const categoryMapping = {
    // 직접 매핑되는 카테고리
    '식비': '식비',
    '교통비': '교통비',
    '통신비': '통신비',
    '여가비': '여가비',

    
    // 나머지는 매핑하지 않음 (4개 핵심 카테고리가 아님)
    '주거비': null,
    '의료비': null,
    '교육비': null,
    '온라인 컨텐츠': null,
    '생활용품비': null,
    '이미용/화장품': null,
    '경조사비': null,
    '금융비': null,
    '기타': null
  };
  
  return categoryMapping[backendCategory] || null;
};

// API 분류 데이터를 처리하는 함수
const processApiData = (apiData) => {
  const characterCategories = {
    '식비': 0,
    '교통비': 0,
    '통신비': 0,
    '여가비': 0
  };
  
  if (Array.isArray(apiData)) {
    apiData.forEach(transaction => {
      const backendCategory = transaction.category;
      const characterCategory = mapToCharacterCategories(backendCategory);
      const amount = parseFloat(transaction.amount || 0);
      
      if (characterCategory && amount > 0) {
        characterCategories[characterCategory] += amount;
      }
    });
  }
  
  // 원 단위를 만원 단위로 변환
  Object.keys(characterCategories).forEach(category => {
    characterCategories[category] = Math.round(characterCategories[category] / 10000 * 100) / 100;
  });
  
  return characterCategories;
};

// categorySummary 데이터를 처리하는 함수 (더 효율적)
const processCategorySummary = () => {
  try {
    const categorySummaryStr = localStorage.getItem('categorySummary');
    if (!categorySummaryStr) return null;
    
    const categorySummary = JSON.parse(categorySummaryStr);
    const characterCategories = {
      '식비': 0,
      '교통비': 0,
      '통신비': 0,
      '여가비': 0
    };
    
    // 각 백엔드 카테고리를 캐릭터 카테고리로 매핑하여 합산
    Object.keys(categorySummary).forEach(backendCategory => {
      const characterCategory = mapToCharacterCategories(backendCategory);
      if (characterCategory) {
        const amount = categorySummary[backendCategory].total_amount || 0;
        // 원 단위를 만원 단위로 변환
        characterCategories[characterCategory] += Math.round(amount / 10000 * 100) / 100;
      }
    });
    
    return characterCategories;
  } catch (e) {
    console.error('categorySummary 처리 오류:', e);
    return null;
  }
};

// 업로드된 엑셀 데이터를 카테고리별로 집계하는 함수
const processUploadedData = (rawData) => {
  // API 분류 데이터인지 확인 (category 필드 존재)
  if (Array.isArray(rawData) && rawData.length > 0 && rawData[0].category) {
    console.log('✅ API 분류 데이터 감지');
    return processApiData(rawData);
  }
  
  // 로컬 파싱 데이터 처리 (한글 컬럼명)
  console.log('⚠️ 로컬 파싱 데이터 - 분류 정보 없음');
  return {
    '식비': 0,
    '교통비': 0,
    '통신비': 0,
    '여가비': 0
  };
};

// 로컬 스토리지에서 사용자 데이터를 로드하는 함수 (실제 업로드 데이터 연동)
export const loadUserSpendingData = () => {
  console.log('🔍 사용자 데이터 로딩 시작...');
  
  // 1. categorySummary 우선 사용 (가장 효율적)
  const categoryData = processCategorySummary();
  if (categoryData) {
    console.log('✅ categorySummary 데이터 사용:', categoryData);
    return categoryData;
  }
  
  // 2. userData에서 직접 계산
  const uploadedData = localStorage.getItem('userData');
  if (uploadedData) {
    try {
      const parsedData = JSON.parse(uploadedData);
      const processedData = processUploadedData(parsedData);
      console.log('✅ userData 처리 완료:', processedData);
      return processedData;
    } catch (e) {
      console.error('❌ 업로드된 데이터 파싱 오류:', e);
    }
  }
  
  // 3. 기존 통계 데이터 확인
  const savedUserSpending = localStorage.getItem('userSpending');
  if (savedUserSpending) {
    try {
      const saved = JSON.parse(savedUserSpending);
      console.log('✅ 저장된 사용자 데이터 사용');
      // 4개 카테고리만 추출
      return {
        '식비': saved['식비'] || 0,
        '교통비': saved['교통비'] || 0,
        '통신비': saved['통신비'] || 0,
        '여가비': saved['여가비'] || 0
      };
    } catch (e) {
      console.error('❌ 저장된 사용자 데이터 파싱 오류:', e);
    }
  }
  
  // 4. 기본값 - 데이터 없음 상태
  console.log('⚠️ 사용 가능한 데이터 없음, 빈 데이터 반환');
  return {
    '식비': 0,
    '교통비': 0,
    '통신비': 0,
    '여가비': 0
  };
};