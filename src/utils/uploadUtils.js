// Frontend upload utilities with enhanced error handling
import axios from 'axios';
import API_BASE_URL from '../config/api';

// Enhanced upload function with retry logic
export const uploadWithRetry = async (formData, onProgress, maxRetries = 3) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Upload attempt ${attempt}/${maxRetries}`);
      
      const response = await axios.post(`${API_BASE_URL}/admin/recordings`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
        timeout: 300000, // 5 minutes timeout
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          if (onProgress) onProgress(percentCompleted);
        },
      });
      
      console.log('Upload successful:', response.data);
      return response.data;
      
    } catch (error) {
      lastError = error;
      console.error(`Upload attempt ${attempt} failed:`, error);
      
      // Don't retry on certain errors
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Authentication failed. Please login again.');
      }
      
      if (error.response?.status === 413) {
        throw new Error('File too large. Maximum size is 30MB.');
      }
      
      if (error.code === 'ERR_NETWORK' && attempt < maxRetries) {
        console.log(`Network error, retrying in ${attempt * 2} seconds...`);
        await new Promise(resolve => setTimeout(resolve, attempt * 2000));
        continue;
      }
      
      if (attempt === maxRetries) {
        break;
      }
    }
  }
  
  // All retries failed
  if (lastError.response?.status === 413) {
    throw new Error('File too large. Please use a file smaller than 30MB.');
  }
  
  if (lastError.code === 'ERR_NETWORK') {
    throw new Error('Network error. Please check your connection and try again.');
  }
  
  throw new Error(lastError.response?.data?.message || 'Upload failed. Please try again.');
};

// File validation utilities
export const validateAudioFile = (file) => {
  const maxSize = 30 * 1024 * 1024; // 30MB
  const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'];
  
  if (!file) {
    throw new Error('Please select an audio file');
  }
  
  if (file.size > maxSize) {
    throw new Error('File too large. Maximum size is 30MB.');
  }
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please select an audio file (MP3, WAV, OGG).');
  }
  
  return true;
};

// Progress tracking utility
export const createProgressTracker = (onProgress) => {
  let lastProgress = 0;
  
  return (progressEvent) => {
    const percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    
    // Only update if progress increased by at least 1%
    if (percentCompleted > lastProgress) {
      lastProgress = percentCompleted;
      if (onProgress) onProgress(percentCompleted);
    }
  };
};
