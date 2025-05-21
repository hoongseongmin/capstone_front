// src/api/userApi.js
import axios from 'axios';
import { API_URL } from '../config';

// 임시 사용자 정보 (개발용)
const TEMP_USERS = [
  {
    id: 1,
    username: "testuser",
    name: "Test User",
    age: 30,
    occupation: "Developer",
    address: "Seoul",
    gender: "Male",
    contact: "010-1234-5678",
    income_level: "Medium"
  }
];

// 임시 로그인 함수 (백엔드 API가 준비되기 전까지 사용)
export const loginUser = async (username, password) => {
  // 개발 환경에서는 임시 로그인 로직 사용
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = TEMP_USERS.find(u => u.username === username);
      if (user && password === "password") {
        resolve({ user, message: "로그인이 성공적으로 완료되었습니다." });
      } else {
        reject({ detail: "사용자명 또는 비밀번호가 올바르지 않습니다" });
      }
    }, 500); // 실제 API 호출처럼 약간의 지연 추가
  });
  
  /* 실제 API 호출 코드 (주석 처리)
  try {
    const response = await axios.post(`${API_URL}/users/login`, {
      username,
      password
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
  */
};

export const registerUser = async (userData) => {
  // 개발 환경에서는 임시 응답 반환
  return Promise.resolve({
    id: Math.floor(Math.random() * 1000) + 10,
    message: "사용자 정보가 성공적으로 등록되었습니다."
  });
  
  /* 실제 API 호출 코드 (주석 처리)
  try {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
  */
};

export const getUserProfile = async (userId) => {
  // 개발 환경에서는 임시 사용자 정보 반환
  return Promise.resolve(
    TEMP_USERS.find(u => u.id === userId) || 
    { error: "사용자를 찾을 수 없습니다." }
  );
  
  /* 실제 API 호출 코드 (주석 처리)
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
  */
};