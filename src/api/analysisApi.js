// src/api/analysisApi.js
import axios from 'axios';
import { API_URL } from '../config';

// 모의 데이터 (실제 API가 준비되기 전까지 사용)
const MOCK_SPENDING_PATTERN = {
  total_spending: 1250000,
  category_breakdown: [
    { category_id: 1, category_name: "식비", total_amount: 350000, percentage: 28 },
    { category_id: 2, category_name: "주거비", total_amount: 450000, percentage: 36 },
    { category_id: 3, category_name: "교통비", total_amount: 150000, percentage: 12 },
    { category_id: 4, category_name: "여가/문화", total_amount: 200000, percentage: 16 },
    { category_id: 5, category_name: "기타", total_amount: 100000, percentage: 8 }
  ]
};

const MOCK_MONTHLY_TREND = {
  monthly_totals: [
    { month: "2023-01", total_amount: 1100000, transaction_count: 25 },
    { month: "2023-02", total_amount: 980000, transaction_count: 22 },
    { month: "2023-03", total_amount: 1050000, transaction_count: 24 },
    { month: "2023-04", total_amount: 1200000, transaction_count: 28 },
    { month: "2023-05", total_amount: 1150000, transaction_count: 26 },
    { month: "2023-06", total_amount: 1250000, transaction_count: 30 }
  ]
};

export const getSpendingPattern = async (userId, startDate, endDate) => {
  // 임시로 모의 데이터 반환
  return Promise.resolve(MOCK_SPENDING_PATTERN);
  
  /* 실제 API 호출 코드 (주석 처리)
  try {
    let url = `${API_URL}/analysis/user/${userId}/spending-pattern`;
    if (startDate && endDate) {
      url += `?start_date=${startDate}&end_date=${endDate}`;
    }
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
  */
};

export const getGroupComparison = async (userId, criteria) => {
  // 임시로 모의 데이터 반환
  return Promise.resolve({
    user_id: userId,
    criteria: criteria,
    criteria_value: "개발자",
    group_size: 12,
    comparison: [
      { category_id: 1, category_name: "식비", user_amount: 350000, group_avg_amount: 320000, diff_percentage: 9.38, diff_status: "평균" },
      { category_id: 2, category_name: "주거비", user_amount: 450000, group_avg_amount: 380000, diff_percentage: 18.42, diff_status: "높음" },
      { category_id: 3, category_name: "교통비", user_amount: 150000, group_avg_amount: 180000, diff_percentage: -16.67, diff_status: "낮음" }
    ]
  });
  
  /* 실제 API 호출 코드 (주석 처리)
  try {
    const response = await axios.get(`${API_URL}/analysis/user/${userId}/group-comparison/${criteria}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
  */
};

export const getMonthlyTrend = async (userId, months = 6) => {
  // 임시로 모의 데이터 반환
  return Promise.resolve(MOCK_MONTHLY_TREND);
  
  /* 실제 API 호출 코드 (주석 처리)
  try {
    const response = await axios.get(`${API_URL}/analysis/user/${userId}/monthly-trend?months=${months}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
  */
};

export const getAnomalies = async (userId) => {
  // 임시로 모의 데이터 반환
  return Promise.resolve({
    user_id: userId,
    anomalies: [
      { category_id: 4, category_name: "여가/문화", month: "2023-04", amount: 350000, average: 180000, type: "비정상적 증가", deviation_percentage: 94.44 }
    ],
    anomaly_count: 1
  });
  
  /* 실제 API 호출 코드 (주석 처리)
  try {
    const response = await axios.get(`${API_URL}/analysis/user/${userId}/anomalies`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
  */
};

export const getInsights = async (userId) => {
  // 임시로 모의 데이터 반환
  return Promise.resolve({
    user_id: userId,
    user_name: "Test User",
    generated_date: new Date().toISOString(),
    insights: [
      {
        type: "top_spending_categories",
        title: "주요 소비 카테고리",
        description: "최근 6개월 동안 가장 많이 지출한 카테고리는 주거비, 식비, 여가/문화입니다.",
        data: MOCK_SPENDING_PATTERN.category_breakdown.slice(0, 3)
      },
      {
        type: "monthly_trend",
        title: "소비 추세",
        description: "최근 월 기준으로 총 지출이 전월 대비 8.7% 증가하고 있습니다.",
        data: [{ month: "2023-06", growth_rate: 8.7 }]
      }
    ]
  });
  
  /* 실제 API 호출 코드 (주석 처리)
  try {
    const response = await axios.get(`${API_URL}/analysis/user/${userId}/insights`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
  */
};