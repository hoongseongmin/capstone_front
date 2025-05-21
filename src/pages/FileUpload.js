// src/pages/FileUpload.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Paper, Typography, Box, Button, 
  Card, CardContent, CircularProgress, Alert
} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import DashboardIcon from '@mui/icons-material/Dashboard';
import * as XLSX from 'xlsx';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // 엑셀 파일 형식 확인 (.xlsx, .xls)
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
    
        // 엑셀 파일 파싱
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // 첫 번째 시트 선택
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            // 시트 데이터를 JSON으로 변환
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            // 로컬 스토리지에 저장
            localStorage.setItem('userData', JSON.stringify(jsonData));
            
            setUploadSuccess(true);
            setUploading(false);
            
            // 3초 후 대시보드로 자동 이동
            setTimeout(() => {
              navigate('/dashboard');
            }, 3000);
          } catch (error) {
            console.error('파일 파싱 오류:', error);
            setError('파일 형식이 올바르지 않습니다.');
            setUploading(false);
          }
        };
        
        reader.onerror = () => {
          setError('파일 읽기 오류가 발생했습니다.');
          setUploading(false);
        };
        
        reader.readAsArrayBuffer(file);
        
      } catch (err) {
        setError('파일 업로드 중 오류가 발생했습니다.');
        setUploading(false);
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          거래 내역 파일 업로드
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 4 }}>
          엑셀 형식(.xlsx, .xls)의 거래 내역 파일을 업로드하여 소비 패턴을 분석해보세요.
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
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
          <Card sx={{ mb: 4 }}>
            <CardContent>
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
            </CardContent>
          </Card>
        )}
        
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            사용 안내
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            • 거래 내역 파일은 엑셀 형식(.xlsx, .xls)으로 업로드해주세요.
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            • 파일에는 거래일자, 금액, 카테고리 등의 정보가 포함되어야 합니다.
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            • 대용량 파일의 경우 업로드에 시간이 소요될 수 있습니다.
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