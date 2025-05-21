// src/api/transactionApi.js
import axios from 'axios';
import { API_URL } from '../config';

// 모의 거래 데이터
const MOCK_TRANSACTIONS = [
  { id: 1, user_id: 1, category_id: 1, category_name: "식비", amount: 35000, transaction_date: "2023-06-15T12:30:00", description: "점심식사", payment_method: "카드" },
  { id: 2, user_id: 1, category_id: 2, category_name: "주거비", amount: 450000, transaction_date: "2023-06-05T09:15:00", description: "월세", payment_method: "계좌이체" },
  { id: 3, user_id: 1, category_id: 3, category_name: "교통비", amount: 50000, transaction_date: "2023-06-10T18:20:00", description: "교통카드 충전", payment_method: "카드" },
  { id: 4, user_id: 1, category_id: 4, category_name: "여가/문화", amount: 30000, transaction_date: "2023-06-18T20:00:00", description: "영화관람", payment_method: "카드" },
  { id: 5, user_id: 1, category_id: 1, category_name: "식비", amount: 65000, transaction_date: "2023-06-20T19:30:00", description: "저녁식사", payment_method: "카드" }
];

export const getUserTransactions = async (userId) => {
  // 임시로 모의 데이터 반환
  return Promise.resolve(MOCK_TRANSACTIONS.filter(t => t.user_id === userId));
  
  /* 실제 API 호출 코드 (주석 처리)
  try {
    const response = await axios.get(`${API_URL}/transactions/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
  */
};

export const createTransaction = async (transactionData) => {
  // 임시로 모의 응답 반환
  const newId = Math.max(...MOCK_TRANSACTIONS.map(t => t.id)) + 1;
  const newTransaction = { id: newId, ...transactionData };
  
  // 실제 저장은 하지 않음 (메모리에만 임시로 저장)
  MOCK_TRANSACTIONS.push(newTransaction);
  
  return Promise.resolve({ id: newId, message: "거래 정보가 성공적으로 등록되었습니다." });
  
  /* 실제 API 호출 코드 (주석 처리)
  try {
    const response = await axios.post(`${API_URL}/transactions`, transactionData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
  */
};

export const deleteTransaction = async (transactionId) => {
  // 임시로 모의 응답 반환
  const index = MOCK_TRANSACTIONS.findIndex(t => t.id === transactionId);
  if (index !== -1) {
    MOCK_TRANSACTIONS.splice(index, 1);
    return Promise.resolve({ message: `거래 ID ${transactionId}가 성공적으로 삭제되었습니다` });
  } else {
    return Promise.reject({ detail: `거래 ID ${transactionId}를 찾을 수 없습니다` });
  }
  
  /* 실제 API 호출 코드 (주석 처리)
  try {
    const response = await axios.delete(`${API_URL}/transactions/${transactionId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
  */
};