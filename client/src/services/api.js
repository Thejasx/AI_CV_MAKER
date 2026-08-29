import axios from 'axios';

const getHeaders = () => {
  const token = localStorage.getItem('aicv_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const parseCVFileApi = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post('/api/resume/parse-file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...getHeaders(),
    },
  });
  return response.data;
};

export const optimizeCVApi = async (rawCVText, jobDescription) => {
  const response = await axios.post(
    '/api/resume/optimize',
    { rawCVText, jobDescription },
    { headers: getHeaders() }
  );
  return response.data;
};

export const saveResumeApi = async (resumeData) => {
  const response = await axios.post('/api/resume/save', resumeData, {
    headers: getHeaders(),
  });
  return response.data;
};

export const getSavedResumesApi = async () => {
  const response = await axios.get('/api/resume/saved', {
    headers: getHeaders(),
  });
  return response.data;
};

export const deleteResumeApi = async (id) => {
  const response = await axios.delete(`/api/resume/delete/${id}`, {
    headers: getHeaders(),
  });
  return response.data;
};

export const loginApi = async (email, password) => {
  const response = await axios.post('/api/auth/login', { email, password });
  return response.data;
};

export const registerApi = async (name, email, password) => {
  const response = await axios.post('/api/auth/register', { name, email, password });
  return response.data;
};
