// 파일 위치: /src/api/classificationApi.js
// 설명: 거래 내역 분류 API 호출 함수

import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

/**
 * 엑셀 파일을 업로드하여 거래 내역을 자동 분류하는 함수
 * @param {File} file - 업로드할 엑셀 파일
 * @returns {Promise} 분류 결과
 */
export const classifyExcelFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(
      `${API_BASE_URL}/api/classification/process-excel-local`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 3000000, // 3000초 타임아웃
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('분류 API 호출 오류:', error);
    throw error;
  }
};