// 파일 위치: /src/pages/FileUpload.js
// 설명: 라디오 버튼을 Select 콤보박스로 변경하고 크기 및 투명도 조정

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Material-UI 컴포넌트들 - Select 관련 추가
import { 
 Container, Paper, Typography, Box, Button, 
 Card, CardContent, CircularProgress, Alert,
 FormControl, InputLabel, Select, MenuItem,
 Stepper, Step, StepLabel
} from '@mui/material';

// Material-UI 아이콘들
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import DashboardIcon from '@mui/icons-material/Dashboard';

// XLSX 라이브러리
import * as XLSX from 'xlsx';

// API 함수 import
import { classifyExcelFile } from '../api/classificationApi';

// 옵션 데이터
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

const FileUpload = () => {
 const [file, setFile] = useState(null);
 const [uploading, setUploading] = useState(false);
 const [uploadSuccess, setUploadSuccess] = useState(false);
 const [error, setError] = useState('');
 const navigate = useNavigate();
 const [currentStep, setCurrentStep] = useState(0);
 const [userSelections, setUserSelections] = useState({
   gender: '',
   age: '',
   region: '',
   occupation: '',
   income: ''
 });

 const handleFileChange = (event) => {
   const selectedFile = event.target.files[0];
   if (selectedFile) {
     if (
       selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
       selectedFile.type === 'application/vnd.ms-excel' ||
       selectedFile.name.endsWith('.xlsx') ||
       selectedFile.name.endsWith('.xls')
     ) {
       setFile(selectedFile);
       setError('');
     } else {
       setFile(null);
       setError('엑셀 파일(.xlsx 또는 .xls)만 업로드 가능합니다.');
     }
   }
 };

const handleSubmit = async (event) => {
 event.preventDefault();
 
 if (!file) {
   setError('파일을 선택해주세요.');
   return;
 }

 try {
   setUploading(true);
   
   // 🔥 파일 정보 검증 로그 추가
   console.log('=== 파일 업로드 시작 ===');
   console.log('파일명:', file.name);
   console.log('파일 크기:', (file.size / 1024 / 1024).toFixed(2), 'MB');
   console.log('파일 타입:', file.type);
   console.log('파일 객체:', file);
   
   // 🔥 새로운 방식: API를 통한 파일 분류
   console.log('API를 통한 거래 내역 분류 중...');
   
   try {
     // FastAPI로 파일 전송하여 분류
     console.log('🚀 API 호출 시작 - classifyExcelFile');
     const classificationResult = await classifyExcelFile(file);
     
     console.log('✅ API 호출 성공!');
     console.log('분류 완료 결과:', classificationResult);
     console.log('총 거래 수:', classificationResult.total_transactions);
     console.log('총 금액:', classificationResult.total_amount);
     console.log('전체 거래 내역 수:', classificationResult.all_transactions?.length);
     console.log('카테고리 요약:', classificationResult.categories_summary);
     
     // 🔥 수정된 부분: 전체 거래 내역을 포함하여 저장
     localStorage.setItem('userData', JSON.stringify(classificationResult.all_transactions || []));
     localStorage.setItem('categorySummary', JSON.stringify(classificationResult.categories_summary || {}));
     localStorage.setItem('classificationSummary', JSON.stringify({
       total_rows: classificationResult.total_transactions,
       classified_rows: classificationResult.total_transactions,
       categories_found: classificationResult.categories_found || Object.keys(classificationResult.categories_summary || {}),
       total_amount: classificationResult.total_amount,
       processing_time: 0,
       file_name: classificationResult.file_name || '',
       file_type: classificationResult.file_type || ''
     }));
     localStorage.setItem('apiResponse', JSON.stringify(classificationResult));
     
     console.log('✅ 로컬 스토리지 저장 완료');
     console.log('저장된 거래 내역 수:', classificationResult.all_transactions?.length);
     
     setUploadSuccess(true);
     setUploading(false);
     
     // 3초 후 대시보드로 자동 이동
     setTimeout(() => {
       navigate('/dashboard');
     }, 3000);
     
   } catch (apiError) {
     console.error('❌ API 분류 실패:', apiError);
     console.error('에러 상세 정보:', {
       message: apiError.message,
       status: apiError.response?.status,
       statusText: apiError.response?.statusText,
       data: apiError.response?.data
     });
     
     console.log('📁 로컬 파싱으로 대체 시작...');
     
     // API 실패 시 기존 로컬 파싱 방식으로 fallback
     const reader = new FileReader();
     
     reader.onload = (e) => {
       try {
         console.log('📖 파일 읽기 완료, 파싱 시작...');
         
         const data = new Uint8Array(e.target.result);
         const workbook = XLSX.read(data, { type: 'array' });
         
         console.log('📊 워크북 정보:', {
           sheetNames: workbook.SheetNames,
           sheetsCount: workbook.SheetNames.length
         });
         
         const firstSheetName = workbook.SheetNames[0];
         const worksheet = workbook.Sheets[firstSheetName];
         const jsonData = XLSX.utils.sheet_to_json(worksheet);
         
         console.log('📋 파싱된 데이터 정보:', {
           rowCount: jsonData.length,
           columns: jsonData.length > 0 ? Object.keys(jsonData[0]) : [],
           firstRow: jsonData[0] || null
         });
         
         localStorage.setItem('userData', JSON.stringify(jsonData));
         console.log('✅ 로컬 파싱 데이터 저장 완료');
         
         setUploadSuccess(true);
         setUploading(false);
         
         // 3초 후 대시보드로 자동 이동
         setTimeout(() => {
           navigate('/dashboard');
         }, 3000);
         
       } catch (error) {
         console.error('❌ 파일 파싱 오류:', error);
         setError('파일 형식이 올바르지 않습니다.');
         setUploading(false);
       }
     };
     
     reader.onerror = () => {
       console.error('❌ 파일 읽기 오류 발생');
       setError('파일 읽기 오류가 발생했습니다.');
       setUploading(false);
     };
     
     reader.readAsArrayBuffer(file);
     
     // 사용자에게 알림
     setError('자동 분류에 실패했지만 파일 업로드를 계속 진행합니다...');
   }
   
 } catch (err) {
   console.error('❌ 파일 업로드 중 전체 오류:', err);
   setError('파일 업로드 중 오류가 발생했습니다.');
   setUploading(false);
 }
};

 const handleSkip = () => {
   navigate('/dashboard');
 };

 const handleSelectionChange = (event) => {
   const { name, value } = event.target;
   setUserSelections(prev => ({
     ...prev,
     [name]: value
   }));
 };

 const handleNext = () => {
   const isAllSelected = Object.values(userSelections).every(value => value !== '');
   if (!isAllSelected) {
     setError('모든 특성을 선택해주세요.');
     return;
   }
   setError('');
   setCurrentStep(1);
   localStorage.setItem('userCharacteristics', JSON.stringify(userSelections));
 };

 const handleBack = () => {
   setCurrentStep(0);
 };

 return (
   <Container maxWidth="lg" sx={{ mt: 4, mb: 4, ml: 'auto', mr: 1 }}>
     <Paper sx={{ 
       p: 4,
       maxWidth: 500,
       ml: 'auto'
     }}>
       <Typography variant="h4" component="h1" align="center" gutterBottom>
         사용자 정보 설정 및 파일 업로드
       </Typography>
       
       {/* 단계 표시기 */}
       <Box sx={{ mb: 4 }}>
         <Stepper activeStep={currentStep} alternativeLabel>
           <Step>
             <StepLabel>사용자 특성 선택</StepLabel>
           </Step>
           <Step>
             <StepLabel>파일 업로드</StepLabel>
           </Step>
         </Stepper>
       </Box>
       
       {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
       
       {/* 1단계: 사용자 특성 선택 */}
       {currentStep === 0 && (
         <Card>
           <CardContent>
             <Typography variant="h6" gutterBottom>
               내 특성 선택
             </Typography>
             <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
               정확한 소비 패턴 비교를 위해 본인의 특성을 선택해주세요.
             </Typography>
             
             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
               {/* 성별 선택 */}
               <FormControl fullWidth sx={{ minWidth: 300 }}>
                 <InputLabel id="gender-label">성별</InputLabel>
                 <Select
                   labelId="gender-label"
                   name="gender"
                   value={userSelections.gender}
                   label="성별"
                   onChange={handleSelectionChange}
                 >
                   {genderOptions.map(option => (
                     <MenuItem key={option.value} value={option.value}>
                       {option.label}
                     </MenuItem>
                   ))}
                 </Select>
               </FormControl>

               {/* 연령대 선택 */}
               <FormControl fullWidth sx={{ minWidth: 300 }}>
                 <InputLabel id="age-label">연령대</InputLabel>
                 <Select
                   labelId="age-label"
                   name="age"
                   value={userSelections.age}
                   label="연령대"
                   onChange={handleSelectionChange}
                 >
                   {ageOptions.map(option => (
                     <MenuItem key={option.value} value={option.value}>
                       {option.label}
                     </MenuItem>
                   ))}
                 </Select>
               </FormControl>

               {/* 거주지 선택 */}
               <FormControl fullWidth sx={{ minWidth: 300 }}>
                 <InputLabel id="region-label">거주지</InputLabel>
                 <Select
                   labelId="region-label"
                   name="region"
                   value={userSelections.region}
                   label="거주지"
                   onChange={handleSelectionChange}
                 >
                   {regionOptions.map(option => (
                     <MenuItem key={option.value} value={option.value}>
                       {option.label}
                     </MenuItem>
                   ))}
                 </Select>
               </FormControl>

               {/* 직업 선택 */}
               <FormControl fullWidth sx={{ minWidth: 300 }}>
                 <InputLabel id="occupation-label">직업</InputLabel>
                 <Select
                   labelId="occupation-label"
                   name="occupation"
                   value={userSelections.occupation}
                   label="직업"
                   onChange={handleSelectionChange}
                 >
                   {occupationOptions.map(option => (
                     <MenuItem key={option.value} value={option.value}>
                       {option.label}
                     </MenuItem>
                   ))}
                 </Select>
               </FormControl>

               {/* 개인소득 선택 */}
               <FormControl fullWidth sx={{ minWidth: 300 }}>
                 <InputLabel id="income-label">개인소득</InputLabel>
                 <Select
                   labelId="income-label"
                   name="income"
                   value={userSelections.income}
                   label="개인소득"
                   onChange={handleSelectionChange}
                 >
                   {incomeOptions.map(option => (
                     <MenuItem key={option.value} value={option.value}>
                       {option.label}
                     </MenuItem>
                   ))}
                 </Select>
               </FormControl>
             </Box>
             
             <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
               <Button 
                 variant="contained" 
                 onClick={handleNext}
                 disabled={!Object.values(userSelections).every(value => value !== '')}
               >
                 다음 단계
               </Button>
             </Box>
           </CardContent>
         </Card>
       )}
       
       {/* 2단계: 파일 업로드 */}
       {currentStep === 1 && (
         <>
           {uploadSuccess ? (
             <Box sx={{ textAlign: 'center', my: 2 }}>
               <Alert severity="success" sx={{ mb: 2 }}>
                 파일이 성공적으로 업로드되었습니다. 대시보드로 이동합니다...
               </Alert>
               <Button 
                 variant="contained" 
                 color="primary"
                 startIcon={<DashboardIcon />}
                 onClick={() => navigate('/dashboard')}
               >
                 대시보드로 이동
               </Button>
             </Box>
           ) : (
             <Card>
               <CardContent>
                 <Typography variant="h6" gutterBottom>
                   거래 내역 파일 업로드
                 </Typography>
                 <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                   엑셀 형식(.xlsx, .xls)의 거래 내역 파일을 업로드하여 소비 패턴을 분석해보세요.
                 </Typography>
                 
                 <Box
                   component="form"
                   onSubmit={handleSubmit}
                   sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                 >
                   <Box
                     sx={{
                       border: '2px dashed #ccc',
                       borderRadius: 2,
                       p: 5,
                       mb: 3,
                       width: '100%',
                       textAlign: 'center',
                       cursor: 'pointer',
                       '&:hover': { borderColor: 'primary.main' }
                     }}
                     onClick={() => document.getElementById('file-input').click()}
                   >
                     <input
                       id="file-input"
                       type="file"
                       accept=".xlsx, .xls"
                       onChange={handleFileChange}
                       style={{ display: 'none' }}
                     />
                     <FileUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                     <Typography variant="h6" component="div" gutterBottom>
                       클릭하여 파일 선택
                     </Typography>
                     <Typography variant="body2" color="text.secondary">
                       또는 파일을 여기에 드래그 앤 드롭하세요
                     </Typography>
                     {file && (
                       <Box sx={{ mt: 2, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                         <Typography variant="body2">{file.name}</Typography>
                       </Box>
                     )}
                   </Box>

                   <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                     <Button
                       variant="outlined"
                       onClick={handleBack}
                       disabled={uploading}
                     >
                       이전 단계
                     </Button>
                     
                     <Box sx={{ display: 'flex', gap: 2 }}>
                       <Button
                         variant="outlined"
                         color="secondary"
                         startIcon={<SkipNextIcon />}
                         onClick={handleSkip}
                         disabled={uploading}
                       >
                         건너뛰기
                       </Button>
                       
                       <Button
                         type="submit"
                         variant="contained"
                         color="primary"
                         disabled={uploading}
                         startIcon={uploading ? <CircularProgress size={20} /> : <FileUploadIcon />}
                       >
                         {uploading ? '업로드 중...' : '파일 업로드'}
                       </Button>
                     </Box>
                   </Box>
                 </Box>
               </CardContent>
             </Card>
           )}
         </>
       )}
       
       {/* 사용 안내 */}
       <Box sx={{ mt: 4 }}>
         <Typography variant="h6" gutterBottom>
           사용 안내
         </Typography>
         <Typography variant="body2" color="text.secondary" paragraph>
           • 1단계에서 선택한 특성 정보는 다른 사용자들과의 소비 패턴 비교에 사용됩니다.
         </Typography>
         <Typography variant="body2" color="text.secondary" paragraph>
           • 거래 내역 파일은 엑셀 형식(.xlsx, .xls)으로 업로드해주세요.
         </Typography>
         <Typography variant="body2" color="text.secondary">
           • 파일 업로드 없이 기본 데이터로 대시보드를 보려면 '건너뛰기' 버튼을 클릭하세요.
         </Typography>
       </Box>
     </Paper>
   </Container>
 );
};

export default FileUpload;